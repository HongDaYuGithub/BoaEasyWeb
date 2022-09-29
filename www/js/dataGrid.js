var editIndex = undefined;
var SystemInfoData = undefined;
var AlarmInfoData = undefined;
var NetWorkConfigData = undefined;
var RadioConfigData = undefined;
var checked = undefined;

function AddDataGrid(ParamsData) {
  $("#dg").datagrid("appendRow", {
    paramsIndex: ParamsData.index,
    paramsName: ParamsData.name,
    paramsCoff: ParamsData.coff,
    paramsAttr: ParamsData.attr,
    paramsType: ParamsData.type,
    paramsValue: ParamsData.value,
    rowsIndex: ParamsData.rows_index,
  });
}

function endEditing() {
  if (editIndex == undefined) {
    return true;
  }
  if ($("#dg").datagrid("validateRow", editIndex)) {
    $("#dg").datagrid("endEdit", editIndex);
    editIndex = undefined;
    return true;
  } else {
    return false;
  }
}

function onClickCell(index, field) {
  if (editIndex != index) {
    if (endEditing()) {
      $("#dg").datagrid("selectRow", index).datagrid("beginEdit", index);
      var ed = $("#dg").datagrid("getEditor", { index: index, field: field });
      if (ed) {
        ($(ed.target).data("textbox")
          ? $(ed.target).textbox("textbox")
          : $(ed.target)
        ).focus();
      }
      editIndex = index;
    } else {
      setTimeout(function () {
        $("#dg").datagrid("selectRow", editIndex);
      }, 0);
    }
  }
}

function UpdateGrid() {}

// 更新客户端数据库
function cancel() {
  $.messager.confirm("Info:", "Whether to cancel the check?", function (r) {
    if (r) {
      $(":checked").removeAttr("checked");
    }
  });
}

//动态申请配置内存
function testDrawDataGrid() {
  var test = new ParamsData(0x1, "hello", 1, "测试", "str", "world", 0);
  var good = new ParamsData(0x2, "hello", 1, "测试", "str", "world", 1);
  AddDataGrid(test);
  AddDataGrid(good);
}

// 更新客户端数据库
function edit() {
  endEditing();
  $.messager.confirm(
    "Info:",
    "Please confirm the submission configuration?",
    function (r) {
      if (r) {
        checked = $("#dg").datagrid("getChecked");
        console.log(checked);
        var CmdWrite = "";
        var tmp = 0;
        for (var i = 0; i < checked.length; i++) {
          if (
            checked[i].paramsType != "str" &&
            checked[i].paramsType != "dstr"
          ) {
            tmp =
              parseFloat(checked[i].paramsCoff) *
              parseFloat(checked[i].paramsValue);
          } else {
            tmp = checked[i].paramsValue;
          }
          CmdWrite += checked[i].paramsIndex + "=" + tmp + "&";
        }
        console.log(CmdWrite);
        var err = undefined;
        RequestFromBoaWritePara(CmdWrite, err);
      } else {
        $(":checked").removeAttr("checked");
      }
    }
  );
}

function RowUpdate(index) {
  var row_index = ParamsDataArray[index].rows_index;
  // console.log(row_index);
  $("#dg").datagrid("updateRow", {
    index: row_index,
    row: {
      paramsValue: ParamsDataArray[index].value,
    },
  });
}

function reload() {
  RequestFromBoaReadPara();
  cacheDataArray = cacheData.split("&");
  console.log(cacheDataArray);

  if (cacheDataParaListArray.length != cacheDataArray.length) {
    $.messager.alert("Error", "Parameter list incomplete");
  } else {
    $.messager.alert("Success", "Get the full parameter list");
  }

  ParaListData2Params(cacheDataParaListArray, ParamsDataArray);
  ParaRead2Params(cacheDataArray, ParamsDataArray);
  ParamsType();

  var TableTmp = undefined;

  if (TableType == "SystemInfoTable") {
    TableTmp = SystemInfoArgs;
  } else if (TableType == "AlarmInfoTable") {
    TableTmp = AlarmInfoArgs;
  } else if (TableType == "OptInfoTable") {
    TableTmp = OptInfoArgs;
  } else if (TableType == "NetConfigTable") {
    TableTmp = NetWorkConfigArgs;
  } else if (TableType == "AlarmConfigTable") {
    TableTmp = AlarmConfigArgs;
  } else if (TableType == "RadioConfigCommonTable") {
    TableTmp = RadioConfigCommonArgs;
  } else if (TableType == "RadioConfigOneTable") {
    TableTmp = RadioConfigOneArgs;
  } else if (TableType == "RadioConfigTwoTable") {
    TableTmp = RadioConfigTwoArgs;
  } else if (TableType == "RadioConfigThreeTable") {
    TableTmp = RadioConfigThreeArgs;
  } else if (TableType == "RadioConfigFourTable") {
    TableTmp = RadioConfigFourArgs;
  } else if (TableType == "CarrierConfigOneTable") {
    TableTmp = CarrierConfigOneArgs;
  } else if (TableType == "CarrierConfigTwoTable") {
    TableTmp = CarrierConfigTwoArgs;
  }
  console.log(TableTmp);
  clearDataTable();
  DrawTable(TableTmp);
}

function getChanges() {
  $.messager.show({
    title: "Modified data that has been submitted",
    height: 400,
    width: 800,
    msg: JSON.stringify(checked),
    showType: "slide",
    timeout: 5000000000,
    style: {
      right: "",
      bottom: "",
    },
  });
}

function clearDataTable() {
  $("#dg").datagrid("loadData", { total: 0, rows: [] });
}

//add data table
function DrawTable(ParamsDataArrayN) {
  for (var i = 0; i < ParamsDataArrayN.length; i++) {
    if (ParamsDataArrayN[i].name != "0") {
      AddDataGrid(ParamsDataArrayN[i]);
    }
  }
}
