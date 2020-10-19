module.exports = class Security {
  constructor(id, name, isin, dol, nseFlag = false, bseFlag = false) {
    this.id = id;
    this.name = name;
    this.isin = isin;
    this.dol = dol;
    this.nseFlag = nseFlag;
    this.bseFlag = bseFlag;
  }
  setNSEFlag() {
    this.nseFlag = true;
  }
  setBSEFlag() {
    this.bseFlag = true;
  }
  getId() {
    return self.id;
  }
  getIsin() {
    return self.isin;
  }
  getDol() {
    return self.Dol;
  }
  getName() {
    return self.Name;
  }
  getDetails() {
    return {
      Symbol: this.id,
      Name: this.name,
      "ISIN No": this.isin,
      "Day of Listing": this.dol ?
        new Date(`${this.dol} 00:00:00 UTC`) : undefined,
      "Listed In NSE": this.nseFlag,
      "Listed In BSE": this.bseFlag,
    };
  }
};
