$(document).ready(function () {
    var grid = $('#grid').DataTable({
        "sAjaxSource": routePath + "odata/OdataEmployees?param=&$expand=Department",
        "aoColumns": [
            { mData: "EmployeeId", oData: "EmployeeId", sType: 'numeric' },
            { mData: "EmployeeName", oData: "EmployeeName", sType: 'string' },
            { mData: "JoinDate", oData: "JoinDate", render: renderDate, sType: 'string' },
            {
                mData: 'EmployeeId', oData: 'EmployeeId', sType: 'numeric', render: function (data, type, full) {
                    return '<a onclick="GetClientReport(' + full.EmployeeId + ')">download document</a>';
                }
            },
            { mData: "Height", oData: "Height", sType: 'string' },
            { mData: "Weight", oData: "Weight", sType: 'string' },
            { mData: 'Department.DepartmenName', oData: 'Department/DepartmenName', sType: 'string' },
            {
                mData: 'EmployeeId', oData: 'EmployeeId', sType: 'numeric', render: function (data, type, full) {
                    return '<a onclick="editRow(' + full.EmployeeId + ')" data-toggle="modal" data-target="#modal1">Update</a>' +
                        ' | ' +
                        '<a onclick="deleteRow(' + full.EmployeeId + ')">Delete</a>';
                }
            }
        ],
        "fnServerData": fnServerOData,
        "bServerSide": true,
        "iODataVersion": 3
    });
    //Sort for ServerSide
    grid.on('draw.dt', function () {
        var info = grid.page.info();
        grid.column(0, { search: 'applied', order: 'applied', page: 'applied' }).nodes().each(function (cell, i) {
            cell.innerHTML = i + 1 + info.start;
        });
    });
    $('#grid_filter input').unbind();
    $('#grid_filter input').bind('keyup', function (e) {
        var param = this.value;
        var url = routePath + "odata/OdataEmployees?param=" + param + "&$expand=Department";
        refreshTable($("#grid"), url);
    });
});

function addRow() {
    if ($("#form1").valid()) {
        if ($('#hdfID').val() == "") {
            insertData();
        } else {
            updateData();
        }

    } else {
        alert('masih ada isian yang kosong');
    }
}

function editRow(id) {
    $.ajax({
        method: "GET",
        url: routePath + "odata/OdataEmployees(" + id + ")"
    }).done(function (msg) {
        $('#hdfID').val(msg.EmployeeId);
        $('#txtName').val(msg.EmployeeName);
        $('#txtJoinDate').val(renderDate(msg.JoinDate));
        $('#txtHeight').val(msg.Height);
        $('#txtWeight').val(msg.Weight);
        $('#ddlDepartment').val(msg.DepartmentId).trigger("change");
    })

    $('#PhotoInput').prop('required', false);
}

function insertData() {
    var formData = new FormData();
    formData.append('file', $('#PhotoInput')[0].files[0]);

    var data = {
        EmployeeName: $('#txtName').val(),
        JoinDate: renderDateInsert($('#txtJoinDate').val()),
        Height: $('#txtHeight').val(),
        Weight: $('#txtWeight').val(),
        DepartmentId: $('#ddlDepartment').val()
    }
    $.ajax({
        method: "POST",
        url: routePath + "odata/OdataEmployees",
        data: data,
        async: false,
        success: function (response) {
            formData.append('id', response.EmployeeId);
            $.ajax({
                method: "POST",
                url: routePath + "Home/UploadFile",
                data: formData,
                async: false,
                contentType: false,
                processData: false,
                success: function (response) {
                    console.log('oke');
                }
            })

            $("#grid").DataTable().ajax.reload();
            $('#modal1').modal('toggle');
            clearForm('form1');
            $.notify({
                title: 'Success!',
                message: 'Success Added Data...'
            }, { type: 'success' });
        },
        error: function (xhr, status) {
            $.notify({
                title: 'Failed!',
                message: xhr.statusText
            }, { type: 'danger' });
        }
    })
}

function updateData() {
    var formData = new FormData();
    formData.append('file', $('#PhotoInput')[0].files[0]);
    formData.append('id', $('#hdfID').val());

    var data = {
        EmployeeName: $('#txtName').val(),
        JoinDate: renderDateUpdate($('#txtJoinDate').val()),
        Height: $('#txtHeight').val(),
        Weight: $('#txtWeight').val(),
        DepartmentId: $('#ddlDepartment').val()
    }
    $.ajax({
        method: "PATCH",
        url: routePath + "odata/OdataEmployees(" + $('#hdfID').val() + ")",
        data: JSON.stringify(data),
        async: false,
        contentType: "application/json",
        success: function (response) {
            $.ajax({
                method: "POST",
                url: routePath + "Home/UploadFile",
                data: formData,
                async: false,
                contentType: false,
                processData: false,
                success: function (response) {
                    console.log('oke');
                }
            })

            $("#grid").DataTable().ajax.reload();
            $('#modal1').modal('toggle');
            clearForm('form1');
            $.notify({
                title: 'Success!',
                message: 'Success Updated Data...'
            }, { type: 'success' });
        },
        error: function (xhr, status) {
            $.notify({
                title: 'Failed!',
                message: xhr.statusText
            }, { type: 'danger' });
        }
    });
}

function deleteRow(id) {
    var con = confirm("Are sure want to delete ?");
    if (con == true) {
        $.ajax({
            method: "DELETE",
            url: routePath + "odata/OdataEmployees(" + id + ")",
            success: function (response) {
                console.log('hapus');
                $("#grid").DataTable().ajax.reload();
                $.notify({
                    title: 'Success!',
                    message: 'Success Delete Data...'
                }, { type: 'success' });
            },
            error: function (xhr, status) {
                $.notify({
                    title: 'Failed!',
                    message: xhr.statusText
                }, { type: 'danger' });
            }
        })
    }
}

function GetClientReport(id) {
    window.open('/Home/GetReport/' + id, "_blank");
};