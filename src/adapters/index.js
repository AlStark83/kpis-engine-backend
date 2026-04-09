import { cardAdapter } from './card.adapter.js';
import { chartAdapter } from './chart.adapter.js';
import { tableAdapter } from './table.adapter.js';
import { exampleAdapter } from './example.adapter.js';

export const ADAPTERS = {
  card: cardAdapter,
  chart: chartAdapter,
  table: tableAdapter,
  example: exampleAdapter
};
