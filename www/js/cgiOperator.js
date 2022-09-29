class ParamsData {
  constructor(index, name, coff, attr, type, value, rows_index) {
    this.index = index;
    this.name = name;
    this.coff = coff;
    this.attr = attr;
    this.type = type;
    this.value = value;
    this.rows_index = rows_index;
  }
}

class CenterBlockClass {
  constructor(index, type, args) {
    this.index = index;
    this.type = type;
    this.args = args;
  }
}

function setCenterBlockEvent(CenterBlockClass) {
  $(CenterBlockClass.index).click(function () {
    var txt = $(this).text();
    $("#CenterBlock").panel({ title: txt });
    clearDataTable();
    TableType = CenterBlockClass.type;
    DrawTable(CenterBlockClass.args);
  });
}
