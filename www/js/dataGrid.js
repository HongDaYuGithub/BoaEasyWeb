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
  $.messager.confirm("信息提示:", "是否取消勾选?", function (r) {
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
  $.messager.confirm("信息提示:", "请确认提交配置?", function (r) {
    if (r) {
      checked = $("#dg").datagrid("getChecked");
      console.log(checked);
      var CmdWrite = "";
      var tmp = 0;
      for (var i = 0; i < checked.length; i++) {
        if (checked[i].paramsType != "str") {
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
  });
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

  var SystemInfoRows = 0;
  var AlarmInfoRows = 0;
  var RadioConfigRows = 0;

  if (cacheDataParaListArray.length != cacheDataArray.length) {
    $.messager.alert("Error", "参数列表不完整");
  } else {
    $.messager.alert("Success", "获取完整参数列表");
  }

  ParaListData2Params(cacheDataParaListArray, ParamsDataArray);
  ParaRead2Params(cacheDataArray, ParamsDataArray);

  var StartParams = ParamsDataArray[1];
  var EndParams = ParamsDataArray[ParamsDataArray.length - 1];
  console.log("ReadFrom Boa ... ...");
  console.log(StartParams);
  console.log(EndParams);

  ParamsType();

  var TableTmp = undefined;

  if (TableType == "SystemInfoTable") {
    TableTmp = SystemInfoArgs;
  } else if (TableType == "AlarmInfoTable") {
    TableTmp = AlarmInfoArgs;
  } else if (TableType == "RadioConfigTable") {
    TableTmp = RadioConfigArgs;
  } else if (TableType == "CarrierConfigTable") {
    TableTmp = CarrierConfigArgs;
  }

  console.log(TableTmp);
  clearDataTable();
  DrawTable(TableTmp);
}

function getChanges() {
  $.messager.show({
    title: "已提交修改的数据",
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
