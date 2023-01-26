import fse from 'fs-extra';

(async () => {
  await fse.copy('prisma', 'dist/prisma', {
    filter: (dest) => {
      if (dest.indexOf('migrations') == -1 && fse.lstatSync(dest).isDirectory()) {
        return true;
      }
      return dest.indexOf('schema.prisma') > -1;
    },
  });
})();
