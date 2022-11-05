/* eslint-disable no-console */
import boxen from 'boxen';
import { bold, green } from 'colorette';
import os from 'os';

type MsgReport = {
  message: string;
  context: string;
};

const generateReport = (...args: Array<MsgReport | null>) => {
  const report = args.filter((arg) => arg !== null);

  const lengthMax = report.reduce(
    (acc, { context }) => (context.length > acc ? context.length : acc),
    0,
  );
  const output: string = report.reduce((acc, { message, context }, index) => {
    const space = ' '.repeat(lengthMax + 2 - context.length);

    const msg = `${bold(green(`- [${context}]`))}${space}${message}`;
    return `${acc}${msg}${index === report.length - 1 ? '' : os.EOL}`;
  }, '');

  console.log(
    boxen(output, {
      title: 'Reports Scripts',
      titleAlignment: 'center',
      margin: {
        top: 1,
        bottom: 1,
        left: 0,
        right: 0,
      },
      padding: 1,
      borderColor: 'green',
      borderStyle: 'bold',
    }),
  );
};

export { generateReport };
export type { MsgReport };
