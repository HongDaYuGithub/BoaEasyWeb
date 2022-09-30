//cgi request url information tag is directions ajax
var cacheDataParaList = undefined;
var cacheDataParaListArray = new Array();
var cacheData = undefined;
var cacheDataArray = new Array();

var TableType = undefined;

var NetWorkConfigArgs = new Array();
var NetWorkConfigFilterIndex = [0x151, 0x152, 0x153];

var SystemInfoArgs = new Array();
var SystemFilterIndex = [0x0a, 0x0102, 0x21, 0x150, 0x0ffd];

var AlarmInfoArgs = new Array();
var AlarmFilterIndex = [0x0301, 0x0302, 0x5c, 0x5d, 0x5e, 0x5f, 0x030f];

var AlarmConfigArgs = new Array();
var AlarmConfigFilterIndex = [0x0201, 0x0202, 0x30, 0x31, 0x32, 0x33, 0x020f];

var CarrierConfigOneArgs = new Array();
var CarrierConfigOneFilterIndex = [0xdf00, 0xdf01, 0xdf11];

var CarrierConfigTwoArgs = new Array();
var CarrierConfigTwoFilterIndex = [0xdf02, 0xdf03, 0xdf13];

var RadioConfigCommonArgs = new Array();
var RadioConfigCommonFilterIndex = [
  0x0c04, 0x0c05, 0xdf09, 0x5c0, 0x04a2, 0x0a51, 0x0c24,
];

var RadioConfigOneArgs = new Array();
var RadioConfigOneFilterIndex = [
  0x442, 0x443, 0x0502, 0x0c20, 0x0c25, 0x0b80, 0x0b84, 0x0b88, 0x0c00, 0xa100,
  0xa104, 0xa150, 0xa160, 0xa10,
];

var RadioConfigTwoArgs = new Array();
var RadioConfigTwoFilterIndex = [
  0x444, 0x445, 0x0503, 0x0c21, 0x0c26, 0x0b81, 0x0b85, 0x0b89, 0x0c01, 0xa101,
  0xa105, 0xa151, 0xa161, 0xa11,
];

var RadioConfigThreeArgs = new Array();
var RadioConfigThreeFilterIndex = [
  0x0c22, 0x0c27, 0x0b82, 0x0b86, 0x0b8a, 0x0c02, 0xa102, 0xa106, 0xa152,
  0xa162, 0x0504, 0xa12,
];

var RadioConfigFourArgs = new Array();
var RadioConfigFourFilterIndex = [
  0x0c23, 0x0c28, 0x0b83, 0x0b87, 0x0b8b, 0x0c03, 0xa103, 0xa107, 0xa153,
  0xa163, 0x0505, 0xa13,
];

var OptInfoArgs = new Array();
var OptInfoFilterIndex = [
  0x05a0, 0x05a1, 0x05a2, 0x05a3, 0x05b0, 0x05b1, 0x05b2, 0x05b3,
];

function FilterIndex(IndexArray, index) {
  for (var i = 0; i < IndexArray.length; i++) {
    if (index == IndexArray[i]) {
      return true;
    }
  }
  return false;
}

function ajaxPost(url_t, msg, func) {
  $.ajax({
    url: url_t,
    type: "POST", //对数据的请求指令使用post的请求方式
    data: msg,
    async: false,
    success: function (data, status) {
      $.messager.alert("Successful", "Operator Successful");
      func(data, status);
    },
    error: function (data, status) {
      $.messager.alert("Failed", "Operator Failed");
    },
  });
}

function RequestFromBoaParaList() {
  ajaxPost("cgi-bin/dru.cgi", "cmd=para_list&nodata", function (data, status) {
    cacheDataParaList = data;
  });
}

function RequestFromBoaReadPara() {
  ajaxPost("cgi-bin/dru.cgi", "cmd=read&nodata", function (data, status) {
    cacheData = data;
  });
}

//may payload some data from client
function RequestFromBoaWritePara(WriteCmd, Error) {
  ajaxPost("cgi-bin/dru.cgi", "cmd=write&" + WriteCmd, function (data, status) {
    Error = data;
  });
}

function ParaListData2Params(RemoteDataArray, ParamsDataArray) {
  var tmp = undefined;
  var tmpCOMMA = undefined;

  var tmpArrayEQ = new Array();
  var tmpArrayCOMMA = new Array();

  for (var i = 1; i < RemoteDataArray.length; i++) {
    tmp = RemoteDataArray[i];
    tmpArrayEQ = tmp.split("=");
    ParamsDataArray[i].index = tmpArrayEQ[0];
    tmpCOMMA = tmpArrayEQ[1];
    tmpArrayCOMMA = tmpCOMMA.split(",");
    ParamsDataArray[i].name = tmpArrayCOMMA[0];
    ParamsDataArray[i].type = tmpArrayCOMMA[1];
    ParamsDataArray[i].coff = tmpArrayCOMMA[2];
  }
}

function ParaRead2Params(RemoteDataArray, ParamsDataArray) {
  var tmp = undefined;
  var tmpArrayEQ = new Array();
  for (var i = 1; i < RemoteDataArray.length; i++) {
    tmp = RemoteDataArray[i];
    tmpArrayEQ = tmp.split("=");
    ParamsDataArray[i].index = tmpArrayEQ[0];
    ParamsDataArray[i].value = tmpArrayEQ[1];
  }
}

function clearCacheGlobData() {
  cacheData = undefined;
  cacheDataArray = null;
  cacheDataParaList = undefined;
  cacheDataParaListArray = null;
}

function ParamsType() {
  var tmp_index = undefined;
  OptInfoArgs.length = 0;
  SystemInfoArgs.length = 0;
  AlarmInfoArgs.length = 0;
  AlarmConfigArgs.length = 0;
  NetWorkConfigArgs.length = 0;
  RadioConfigCommonArgs.length = 0;
  RadioConfigFourArgs.length = 0;
  RadioConfigOneArgs.length = 0;
  RadioConfigTwoArgs.length = 0;
  RadioConfigThreeArgs.length = 0;
  CarrierConfigOneArgs.length = 0;
  CarrierConfigTwoArgs.length = 0;
  for (var i = 0; i < ParamsDataArray.length; i++) {
    tmp_index = parseInt(ParamsDataArray[i].index);
    if (FilterIndex(SystemFilterIndex, tmp_index)) {
      SystemInfoArgs.push(ParamsDataArray[i]);
    } else if (FilterIndex(OptInfoFilterIndex, tmp_index)) {
      OptInfoArgs.push(ParamsDataArray[i]);
    } else if (FilterIndex(AlarmFilterIndex, tmp_index)) {
      AlarmInfoArgs.push(ParamsDataArray[i]);
    } else if (FilterIndex(AlarmConfigFilterIndex, tmp_index)) {
      AlarmConfigArgs.push(ParamsDataArray[i]);
    } else if (FilterIndex(RadioConfigCommonFilterIndex, tmp_index)) {
      RadioConfigCommonArgs.push(ParamsDataArray[i]);
    } else if (FilterIndex(RadioConfigOneFilterIndex, tmp_index)) {
      RadioConfigOneArgs.push(ParamsDataArray[i]);
    } else if (FilterIndex(RadioConfigTwoFilterIndex, tmp_index)) {
      RadioConfigTwoArgs.push(ParamsDataArray[i]);
    } else if (FilterIndex(RadioConfigThreeFilterIndex, tmp_index)) {
      RadioConfigThreeArgs.push(ParamsDataArray[i]);
    } else if (FilterIndex(RadioConfigFourFilterIndex, tmp_index)) {
      RadioConfigFourArgs.push(ParamsDataArray[i]);
    } else if (FilterIndex(CarrierConfigOneFilterIndex, tmp_index)) {
      CarrierConfigOneArgs.push(ParamsDataArray[i]);
    } else if (FilterIndex(CarrierConfigTwoFilterIndex, tmp_index)) {
      CarrierConfigTwoArgs.push(ParamsDataArray[i]);
    } else if (FilterIndex(NetWorkConfigFilterIndex, tmp_index)) {
      NetWorkConfigArgs.push(ParamsDataArray[i]);
    }
  }
}

var ParamsDataArray = new Array();

$(function () {
  clearCacheGlobData();
  clearDataTable();
  RequestFromBoaParaList();
  cacheDataParaListArray = cacheDataParaList.split("&");
  console.log(cacheDataParaListArray);

  RequestFromBoaReadPara();
  cacheDataArray = cacheData.split("&");
  console.log(cacheDataArray);

  if (cacheDataParaListArray.length != cacheDataArray.length) {
    $.messager.alert("Error", "Parameter list incomplete");
  } else {
    $.messager.alert("Success", "Get the full parameter list");
  }

  for (var i = 0; i < cacheDataArray.length; i++) {
    ParamsDataArray.push(new ParamsData("0", "0", "0", "0", "0", "0", "0"));
  }

  ParaListData2Params(cacheDataParaListArray, ParamsDataArray);
  ParaRead2Params(cacheDataArray, ParamsDataArray);

  for (var i = 0; i < ParamsDataArray.length; i++) {
    if (ParamsDataArray[i].type != "str" && ParamsDataArray[i].type != "dstr") {
      ParamsDataArray[i].value =
        parseFloat(ParamsDataArray[i].value) /
        parseFloat(ParamsDataArray[i].coff);
    }
  }

  ParamsType();

  // console.log(ParamsDataArray);

  var DeviceInfo = new Object();
  DeviceInfo.SystemInfo = new CenterBlockClass(
    "#SystemInfo",
    "SystemInfoTable",
    SystemInfoArgs
  );

  DeviceInfo.AlarmInfo = new CenterBlockClass(
    "#AlarmInfo",
    "AlarmInfoTable",
    AlarmInfoArgs
  );

  DeviceInfo.OptInfo = new CenterBlockClass(
    "#OptInfo",
    "OptInfoTable",
    OptInfoArgs
  );

  var DeviceConfig = new Object();
  DeviceConfig.NetWorkConfig = new CenterBlockClass(
    "#NetWorkConfig",
    "NetConfigTable",
    NetWorkConfigArgs
  );

  DeviceConfig.AlarmConfig = new CenterBlockClass(
    "#AlarmConfig",
    "AlarmConfigTable",
    AlarmConfigArgs
  );

  DeviceConfig.RadioConfigCommon = new CenterBlockClass(
    "#RadioConfigCommon",
    "RadioConfigCommonTable",
    RadioConfigCommonArgs
  );

  DeviceConfig.RadioConfigOne = new CenterBlockClass(
    "#RadioConfigOne",
    "RadioConfigOneTable",
    RadioConfigOneArgs
  );

  DeviceConfig.RadioConfigTwo = new CenterBlockClass(
    "#RadioConfigTwo",
    "RadioConfigTwoTable",
    RadioConfigTwoArgs
  );

  DeviceConfig.RadioConfigThree = new CenterBlockClass(
    "#RadioConfigThree",
    "RadioConfigThreeTable",
    RadioConfigThreeArgs
  );

  DeviceConfig.RadioConfigFour = new CenterBlockClass(
    "#RadioConfigFour",
    "RadioConfigFourTable",
    RadioConfigFourArgs
  );

  DeviceConfig.CarrierConfigOne = new CenterBlockClass(
    "#CarrierConfigOne",
    "CarrierConfigOneTable",
    CarrierConfigOneArgs
  );

  DeviceConfig.CarrierConfigTwo = new CenterBlockClass(
    "#CarrierConfigTwo",
    "CarrierConfigTwoTable",
    CarrierConfigTwoArgs
  );

  var CenterBlockEvent = new Array();
  CenterBlockEvent["SystemInfo"] = DeviceInfo.SystemInfo;
  CenterBlockEvent["AlarmInfo"] = DeviceInfo.AlarmInfo;
  CenterBlockEvent["OptInfo"] = DeviceInfo.OptInfo;
  CenterBlockEvent["NetWorkConfig"] = DeviceConfig.NetWorkConfig;
  CenterBlockEvent["AlarmConfig"] = DeviceConfig.AlarmConfig;
  CenterBlockEvent["RadioConfigCommon"] = DeviceConfig.RadioConfigCommon;
  CenterBlockEvent["RadioConfigOne"] = DeviceConfig.RadioConfigOne;
  CenterBlockEvent["RadioConfigTwo"] = DeviceConfig.RadioConfigTwo;
  CenterBlockEvent["RadioConfigThree"] = DeviceConfig.RadioConfigThree;
  CenterBlockEvent["RadioConfigFour"] = DeviceConfig.RadioConfigFour;
  CenterBlockEvent["CarrierConfigOne"] = DeviceConfig.CarrierConfigOne;
  CenterBlockEvent["CarrierConfigTwo"] = DeviceConfig.CarrierConfigTwo;

  $("#tt").tree({
    onClick: function (node) {
      var index = node.text;
      var ack_index = index.split('"');
      var txt = ack_index[2];
      $("#HomeIndex").tabs("select", FirstTmp);
      var tab = $("#HomeIndex").tabs("getSelected");
      $("#HomeIndex").tabs("update", {
        tab: tab,
        options: {
          title: txt,
        },
      });
      do {
        if (ack_index[1] == undefined) {
          break;
        }
        FirstTmp = txt;
        clearDataTable();
        TableType = CenterBlockEvent[ack_index[1]].type;
        DrawTable(CenterBlockEvent[ack_index[1]].args);
      } while (0);
    },
  });
});
