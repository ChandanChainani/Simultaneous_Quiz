const operations = {
  "+": function(args) {
    return args.reduce((x, y) => x + y);
  },
  "-": function(args) {
    return args.reduce((x, y) => x - y);
  },
  "*": function(args) {
    return args.reduce((x, y) => x * y);
  },
  "/": function(args) {
    return args.reduce((x, y) => x / y).toFixed(1);
  },
};

export default operations;
