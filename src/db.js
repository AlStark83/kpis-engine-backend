import dotenv from 'dotenv';

dotenv.config({ quiet: true });

const requiredEnvVars = ['DB_NAME', 'DB_USER', 'DB_PASS', 'DB_HOST'];

const hasDatabaseConfig = requiredEnvVars.every((key) => {
  const value = process.env[key];
  return typeof value === 'string' && value.trim().length > 0;
});

let conn = null;

const patchMssqlChangeColumn = (sequelizeConnection) => {
  if (!sequelizeConnection || sequelizeConnection.getDialect() !== 'mssql') {
    return;
  }

  const queryInterface = sequelizeConnection.getQueryInterface();
  const generator = queryInterface.queryGenerator;

  if (generator.__patchedMssqlChangeColumn) {
    return;
  }

  const originalChangeColumnQuery = generator.changeColumnQuery.bind(generator);

  generator.changeColumnQuery = function changeColumnQuery(tableName, attributes) {
    const tableQuoted = this.quoteTable(tableName);
    const alterFragments = [];
    const addConstraintFragments = [];
    const defaultFragments = [];
    let commentString = '';

    for (const attributeName of Object.keys(attributes)) {
      const quotedAttrName = this.quoteIdentifier(attributeName);
      let definition = attributes[attributeName];

      if (typeof definition !== 'string') {
        definition = this.attributeToSQL(definition, { context: 'changeColumn' });
      }

      if (!definition) {
        continue;
      }

      if (definition.includes('COMMENT ')) {
        const commentMatch = definition.match(/^(.*) (COMMENT.*)$/);

        if (commentMatch) {
          const commentText = commentMatch[2].replace('COMMENT', '').trim();
          commentString += this.commentTemplate(commentText, tableName, attributeName);
          definition = commentMatch[1];
        }
      }

      if (definition.includes('REFERENCES')) {
        addConstraintFragments.push(
          `FOREIGN KEY (${quotedAttrName}) ${definition.replace(/.+?(?=REFERENCES)/, '')}`
        );
        continue;
      }

      const defaultMatch = definition.match(/\sDEFAULT\s+(.+)$/i);

      if (defaultMatch) {
        const defaultValue = defaultMatch[1].trim().replace(/;$/, '');
        defaultFragments.push(
          `ALTER TABLE ${tableQuoted} ADD DEFAULT ${defaultValue} FOR ${quotedAttrName};`
        );
        definition = definition.replace(/\sDEFAULT\s+(.+)$/i, '').trim();
      }

      if (definition) {
        alterFragments.push(`${quotedAttrName} ${definition}`);
      }
    }

    const statements = [];

    if (alterFragments.length) {
      statements.push(`ALTER TABLE ${tableQuoted} ALTER COLUMN ${alterFragments.join(', ')};`);
    }

    if (addConstraintFragments.length) {
      statements.push(`ALTER TABLE ${tableQuoted} ADD ${addConstraintFragments.join(', ')};`);
    }

    if (commentString) {
      statements.push(commentString.trim());
    }

    if (defaultFragments.length) {
      statements.push(...defaultFragments);
    }

    if (!statements.length) {
      return originalChangeColumnQuery.call(this, tableName, attributes);
    }

    return statements.join(' ');
  };

  generator.__patchedMssqlChangeColumn = true;
};

if (hasDatabaseConfig) {
  try {
    const { Sequelize } = await import('sequelize');

    conn = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
      host: process.env.DB_HOST,
      dialect: 'mssql',
      port: process.env.DB_PORT || 1433,
      dialectOptions: {
        options: {
          encrypt: process.env.DB_ENCRYPT !== 'false'
        }
      },
      logging: false
    });

    patchMssqlChangeColumn(conn);
  } catch (error) {
    console.warn('[db] Sequelize connection unavailable:', error.message);
    conn = null;
  }
} else {
  console.warn('[db] Database environment variables are incomplete. Auth will use fallback mode.');
}

export { conn };
