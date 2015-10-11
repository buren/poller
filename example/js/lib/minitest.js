function test(label, testFunction) {
  var self = this;
  self.testLabel = label;
  self.itLabel;
  var label  = function() { return self.testLabel + ' ' + self.itLabel; };
  var passed = function() { console.log(true, label()); };
  var failed = function() { console.error(false, label()); };
  var print  = function(t) { t ? passed() : failed(); };

  self.it = function(label, itFunction) {
    self.itLabel = label;
    return itFunction(self.assert);
  };

  self.assert = function(value) {
    print(value === true)
  };
  testFunction(self.it);
}
