//cgi request url information tag is directions ajax
var cacheDataParaList = undefined;
var cacheDataParaListArray = new Array();
var cacheData = undefined;
var cacheDataArray = new Array();

var TableType = undefined;

var SystemInfoArgs = new Array();
var AlarmInfoArgs = new Array();
var NetWorkConfigArgs = new Array();
var RadioConfigArgs = new Array();
var CarrierConfigArgs = new Array();

function ajaxPost(url_t, msg, func) {
  $.ajax({
    url: url_t,
    type: "POST", //对数据的请求指令使用post的请求方式
    data: msg,
    async: false,
    success: function (data, status) {
      func(data, status);
    },
    error: function (data, status) {
      $.messager.alert("Error", "加载远程数据失败");
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
  SystemInfoArgs.length = 0;
  AlarmInfoArgs.length = 0;
  RadioConfigArgs.length = 0;
  CarrierConfigArgs.length = 0;
  for (var i = 0; i < ParamsDataArray.length; i++) {
    tmp_index = parseInt(ParamsDataArray[i].index);
    if (
      tmp_index <= 0x024 ||
      (tmp_index >= 0x601 && tmp_index <= 0x607) ||
      (tmp_index >= 0x101 && tmp_index <= 0x166)
    ) {
      SystemInfoArgs.push(ParamsDataArray[i]);
    } else if (
      (tmp_index >= 0x200 && tmp_index <= 0x0300) ||
      (tmp_index >= 0x30 && tmp_index <= 0x49)
    ) {
      AlarmInfoArgs.push(ParamsDataArray[i]);
    } else if (tmp_index >= 0x400 && tmp_index < 0xdf00) {
      RadioConfigArgs.push(ParamsDataArray[i]);
    } else if (tmp_index >= 0xdf00 && tmp_index <= 0xdf13) {
      CarrierConfigArgs.push(ParamsDataArray[i]);
    }
  }
}

var ParamsDataArray = new Array();

$(function () {
  var SystemInfoRows = 0;
  var AlarmInfoRows = 0;
  var RadioConfigRows = 0;
  clearCacheGlobData();
  clearDataTable();
  RequestFromBoaParaList();
  cacheDataParaListArray = cacheDataParaList.split("&");
  console.log(cacheDataParaListArray);

  RequestFromBoaReadPara();
  cacheDataArray = cacheData.split("&");
  console.log(cacheDataArray);

  if (cacheDataParaListArray.length != cacheDataArray.length) {
    $.messager.alert("Error", "参数列表不完整");
  } else {
    $.messager.alert("Success", "获取完整参数列表");
  }

  for (var i = 0; i < cacheDataArray.length; i++) {
    ParamsDataArray.push(new ParamsData("0", "0", "0", "0", "0", "0", "0"));
  }

  ParaListData2Params(cacheDataParaListArray, ParamsDataArray);
  ParaRead2Params(cacheDataArray, ParamsDataArray);

  ParamsType();

  console.log(ParamsDataArray);

  console.log("System Info ... ...\n");
  console.log(SystemInfoArgs);

  console.log("Alarms Info ... ...\n");
  console.log(AlarmInfoArgs);

  console.log("Radio info");
  console.log(RadioConfigArgs);

  var DeviceInfo = new Object();
  DeviceInfo.SystemInfo = new CenterBlockClass(
    "a#SystemInfo",
    "SystemInfoTable",
    SystemInfoArgs
  );

  DeviceInfo.AlarmInfo = new CenterBlockClass(
    "a#AlarmInfo",
    "AlarmInfoTable",
    AlarmInfoArgs
  );

  var DeviceConfig = new Object();
  DeviceConfig.NetWorkConfig = new CenterBlockClass(
    "a#NetWorkConfig",
    "NetConfigTable",
    NetWorkConfigArgs
  );
  DeviceConfig.RadioConfig = new CenterBlockClass(
    "a#RadioConfig",
    "RadioConfigTable",
    RadioConfigArgs
  );

  DeviceConfig.CarrierConfig = new CenterBlockClass(
    "a#CarrierConfig",
    "CarrierConfigTable",
    CarrierConfigArgs
  );

  var CenterBlockEvent = [
    DeviceInfo.SystemInfo,
    DeviceInfo.AlarmInfo,
    DeviceConfig.NetWorkConfig,
    DeviceConfig.RadioConfig,
    DeviceConfig.CarrierConfig,
  ];

  for (i = 0; i < CenterBlockEvent.length; i++) {
    setCenterBlockEvent(CenterBlockEvent[i]);
  }
});
