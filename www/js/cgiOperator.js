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

var FirstTmp = "Home";
function setCenterBlockEvent(CenterBlockClass) {
  $(CenterBlockClass.index).click(function () {
    var txt = $(this).text();
    $("#HomeIndex").tabs("select", FirstTmp);
    var tab = $("#HomeIndex").tabs("getSelected");
    $("#HomeIndex").tabs("update", {
      tab: tab,
      options: {
        title: txt,
      },
    });
    FirstTmp = txt;
    clearDataTable();
    TableType = CenterBlockClass.type;
    DrawTable(CenterBlockClass.args);
  });
}

