var jpdbBaseURL = "http://api.login2explore.com:5577";
var jpdbIRL = "/api/irl";
var jpdbIML = "api/iml";
var empDBName = "EMP-DB";
var empRelationName = "EmpData";
var connToken = "90937398|-31949270228626032|90955299";

$("#empId").focus();

function saveRecno2LS(jsonObj){
    var lvData = JSON.parse(jsonObj.data);
    localStorage.setItem('recno',lvData.rec_no);

}

function getEmpIdAsJsonObj(){
    var empid = $('#empid').val();
    var jsonStr={
        id:empid
    }
    return JSON.stringify(jsonStr)
}

function fillData(jsonObj){
    saveRecno2LS(jsonObj);
    var record = JSON.parse(jsonOBJ.data).record;
    $("#empName").val(data.empName);
    $("#basicSalary").val(data.empbs);
    $("#hra").val(data.emphra);
    $("#da").val(data.empda);
    $("#deduction").val(data.empdeduction);
}

function validateAndGetFormData() {
    var empIdVar = $("#empId").val();
    if (empIdVar === "") {
        alert("Employee ID Required Value");
        $("#empId").focus();
        return "";
    }
    var empNameVar = $("#empName").val();
    if (empNameVar === "") {
        alert("Employee Name is Required Value");
        $("#empName").focus();
        return "";
    }
    var empbasicSalaryVar = $("#basicSalary").val();
    if (empbasicSalaryVar === "") {
        alert("basic salary  is Required Value");
        $("#basicSalary").focus();
        return "";
    }
    var emphraVar = $("#hra").val();
    if (emphraVar === "") {
        alert("hra is Required Value");
        $("#hra").focus();
        return "";
    }
    var empdaVar = $("#da").val();
    if (empdaVar === "") {
        alert("da is Required Value");
        $("#da").focus();
        return "";
    }
    var empdeductionVar = $("#deduction").val();
    if (empdaVar === "") {
        alert("da is Required Value");
        $("#deduction").focus();
        return "";
    }
    var jsonStrObj = {
        empId: empIdVar,
        empName: empNameVar,
        empbs:empbasicSalaryVar ,
        emphra:emphraVar,
        empda:empdaVar,
        empdeduction:empdeductionVar
    };
    return JSON.stringify(jsonStrObj);
}
// This method is used to create PUT Json request.
function createPUTRequest(connToken, jsonObj, dbName, relName) {
    var putRequest = "{\n"
        + "\"token\" : \""
        + connToken
        + "\","
        + "\"dbName\": \""
        + dbName
        + "\",\n" + "\"cmd\" : \"PUT\",\n"
        + "\"rel\" : \""
        + relName + "\","
        + "\"jsonStr\": \n"
        + jsonObj
        + "\n"
        + "}";
    return putRequest;
}
function executeCommand(reqString, dbBaseUrl, apiEndPointUrl) {
    var url = dbBaseUrl + apiEndPointUrl;
    var jsonObj;
    $.post(url, reqString, function (result) {
        jsonObj = JSON.parse(result);
    }).fail(function (result) {
        var dataJsonObj = result.responseText;
        jsonObj = JSON.parse(dataJsonObj);
    });
    return jsonObj;
}

function saveEmployee() {
    var jsonStr = validateAndGetFormData();
    if (jsonStr === "") {
        return;
    }
    var putReqStr = createPUTRequest("90937398|-31949270228626032|90955299",
        jsonStr, "EMP-DB", "EmpData");
    alert(putReqStr);
    jQuery.ajaxSetup({ async: false });
    var resultObj = executeCommand(putReqStr,
        "http://api.login2explore.com:5577", "/api/iml");
    alert(JSON.stringify(resultObj));
    jQuery.ajaxSetup({ async: true });
    resetForm();
}

function resetForm() {
    $("#empId").val("")
    $("#empName").val("");
    $("#basicSalary").val("");
    $("#hra").val("");
    $("#da").val("");
    $("#deduction").val("");
    $("#empId").prop("disabled",false);
    $("#save").prop("disabled",true);
    $("#change").prop("disabled",true);
    $("#reset").prop("disabled",true);
    $("#empId").focus();
}

function changeData(){
    $("#change").prop("disabled",true);
    jsonChg = validateAndGetFormData();
    var updateRequest = createUPDATERecordRequest(connToken,jsonChg,empDBName,empRelationName,localStorage.getItem());
    jQuery.ajaxSetup({async:false});
    var resJsonObj = executeCommandAtGivenBaseUrl(updateRequest,jpdbBaseURL,jpdbIML);
    jQuery.ajaxSetup({async:true});
    console.log(resJsonObj);
    resetForm();
    $("#empId").focus();


}

function getEmp(){
    var empIdJsonObj = getEmpIdAsJsonObj();
    var getRequest = createGET_BY_KEYRequest(connToken,empDBName,empRelationName,empIdJsonObj);
    jQuery.ajaxSetup({async:false});
    var resJsonObj = executeCommandAtGivenBaseUrl(getRequest,jpdbBaseURL,jpdbIRL);
    jQuery.ajaxSetup({async:true});
    if(resJsonObj.status===4000){
        $('#save').prop('disabled',false);
        $('#reset').prop('disabled',false);
        $('#empName').focus();
    }else if(resJsonObj.status===200){
        $('#empId').prop('disabled',true);
        fillData(resJsonObj);
        $('#change').prop('disabled',false);
        $('#reset').prop('disabled',false);
        $('#empName').focus();

    }
}
