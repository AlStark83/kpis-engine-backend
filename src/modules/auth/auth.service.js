import { conn } from '../../db.js';

const EMAIL_COLUMNS = ['email', 'correo', 'mail', 'usuario', 'user_email', 'correo_electronico'];
const PASSWORD_COLUMNS = ['password', 'passwd', 'pass', 'contrasena', 'password_hash', 'clave'];
const ACTIVE_COLUMNS = ['active', 'is_active', 'activo', 'estatus', 'status', 'enabled'];
const ID_COLUMNS = ['id', 'user_id', 'usuario_id', 'id_usuario'];
const NAME_COLUMNS = ['name', 'nombre', 'full_name', 'display_name', 'usuario', 'username'];
const ROLE_COLUMNS = ['role', 'rol', 'perfil', 'puesto', 'user_role'];

const MOCK_USER = {
  id: Number(process.env.AUTH_MOCK_USER_ID || 9999),
  name: process.env.AUTH_MOCK_NAME || 'Usuario Demo',
  role: process.env.AUTH_MOCK_ROLE || 'finanzas',
  email: process.env.AUTH_MOCK_EMAIL || 'usuario@empresa.com',
  password: process.env.AUTH_MOCK_PASSWORD || '123456',
  active: true
};

let cachedUserSource = null;

const escapeSqlIdentifier = (value) => `[${String(value).replace(/]/g, ']]')}]`;

const normalizeValue = (value) => String(value || '').trim().toLowerCase();

const pickFirstValue = (record, candidates) => {
  for (const column of candidates) {
    if (record?.[column] !== undefined && record?.[column] !== null) {
      return record[column];
    }
  }

  return null;
};

const isUserActive = (record) => {
  const activeValue = pickFirstValue(record, ACTIVE_COLUMNS);

  if (activeValue === null || activeValue === undefined) {
    return true;
  }

  const normalized = normalizeValue(activeValue);

  return !['0', 'false', 'inactive', 'inactivo', 'disabled', 'bloqueado'].includes(normalized);
};

const passwordsMatch = (record, password) => {
  const storedPassword = pickFirstValue(record, PASSWORD_COLUMNS);

  if (storedPassword === null || storedPassword === undefined) {
    return false;
  }

  return String(storedPassword) === String(password);
};

const mapUser = (record) => ({
  id: pickFirstValue(record, ID_COLUMNS) ?? null,
  name: pickFirstValue(record, NAME_COLUMNS) || 'Usuario',
  role: pickFirstValue(record, ROLE_COLUMNS) || 'usuario',
  email: pickFirstValue(record, EMAIL_COLUMNS) || null
});

const getMockUser = ({ email, password }) => {
  if (normalizeValue(email) !== normalizeValue(MOCK_USER.email)) {
    return null;
  }

  if (String(password) !== String(MOCK_USER.password)) {
    return null;
  }

  return {
    id: MOCK_USER.id,
    name: MOCK_USER.name,
    role: MOCK_USER.role,
    email: MOCK_USER.email
  };
};

const fetchCandidateColumns = async () => {
  if (!conn || typeof conn.query !== 'function') {
    return [];
  }

  const interestingColumns = [
    ...EMAIL_COLUMNS,
    ...PASSWORD_COLUMNS,
    ...ACTIVE_COLUMNS,
    ...ID_COLUMNS,
    ...NAME_COLUMNS,
    ...ROLE_COLUMNS
  ];

  const placeholders = interestingColumns.map((_, index) => `:col${index}`).join(', ');
  const replacements = interestingColumns.reduce((accumulator, column, index) => {
    accumulator[`col${index}`] = column;
    return accumulator;
  }, {});

  const [rows] = await conn.query(
    `
      SELECT TABLE_SCHEMA, TABLE_NAME, COLUMN_NAME
      FROM INFORMATION_SCHEMA.COLUMNS
      WHERE COLUMN_NAME IN (${placeholders})
    `,
    { replacements }
  );

  return Array.isArray(rows) ? rows : [];
};

const buildUserSource = (columns) => {
  const tableMap = new Map();

  for (const row of columns) {
    const key = `${row.TABLE_SCHEMA}.${row.TABLE_NAME}`;

    if (!tableMap.has(key)) {
      tableMap.set(key, {
        schema: row.TABLE_SCHEMA,
        table: row.TABLE_NAME,
        columns: new Set()
      });
    }

    tableMap.get(key).columns.add(row.COLUMN_NAME);
  }

  const candidates = Array.from(tableMap.values())
    .map((entry) => {
      const hasEmail = EMAIL_COLUMNS.some((column) => entry.columns.has(column));
      const hasPassword = PASSWORD_COLUMNS.some((column) => entry.columns.has(column));

      if (!hasEmail || !hasPassword) {
        return null;
      }

      const score =
        (ACTIVE_COLUMNS.some((column) => entry.columns.has(column)) ? 1 : 0) +
        (NAME_COLUMNS.some((column) => entry.columns.has(column)) ? 1 : 0) +
        (ROLE_COLUMNS.some((column) => entry.columns.has(column)) ? 1 : 0) +
        (ID_COLUMNS.some((column) => entry.columns.has(column)) ? 1 : 0);

      return {
        schema: entry.schema,
        table: entry.table,
        emailColumn: EMAIL_COLUMNS.find((column) => entry.columns.has(column)),
        passwordColumn: PASSWORD_COLUMNS.find((column) => entry.columns.has(column)),
        score
      };
    })
    .filter(Boolean)
    .sort((left, right) => right.score - left.score);

  return candidates[0] || null;
};

const discoverUserSource = async () => {
  if (cachedUserSource !== null) {
    return cachedUserSource;
  }

  try {
    const columns = await fetchCandidateColumns();
    cachedUserSource = buildUserSource(columns);
  } catch (error) {
    console.warn('[auth] Could not discover user table:', error.message);
    cachedUserSource = null;
  }

  return cachedUserSource;
};

export const findUserByEmail = async (email) => {
  const userSource = await discoverUserSource();

  if (!userSource || !conn || typeof conn.query !== 'function') {
    return null;
  }

  const [rows] = await conn.query(
    `
      SELECT TOP 1 *
      FROM ${escapeSqlIdentifier(userSource.schema)}.${escapeSqlIdentifier(userSource.table)}
      WHERE ${escapeSqlIdentifier(userSource.emailColumn)} = :email
    `,
    { replacements: { email } }
  );

  if (!Array.isArray(rows) || rows.length === 0) {
    return null;
  }

  return rows[0];
};

export const login = async ({ email, password }) => {
  try {
    const user = await findUserByEmail(email);

    if (user) {
      if (!isUserActive(user)) {
        return {
          success: false,
          message: 'Usuario inactivo'
        };
      }

      if (!passwordsMatch(user, password)) {
        return {
          success: false,
          message: 'Credenciales invalidas'
        };
      }

      return {
        success: true,
        user: mapUser(user)
      };
    }
  } catch (error) {
    console.warn('[auth] Database validation failed. Using fallback mode:', error.message);
  }

  const mockUser = getMockUser({ email, password });

  if (mockUser) {
    return {
      success: true,
      user: mockUser
    };
  }

  return {
    success: false,
    message: 'Credenciales invalidas'
  };
};
