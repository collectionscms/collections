declare const PROJECT_ENTRY: string;

try {
  if (PROJECT_ENTRY) {
    require(PROJECT_ENTRY);
  }
} catch (e) {
  console.log(e);
}
