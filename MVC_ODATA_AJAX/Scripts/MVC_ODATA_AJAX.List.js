$(document).ready(function () {
    var grid = $('#grid').DataTable({
        "sAjaxSource": routePath + "odata/OdataEmployees?param=&$expand=Department",
        "aoColumns": [
            { mData: "EmployeeId", oData: "EmployeeId", sType: 'numeric' },
            { mData: "EmployeeName", oData: "EmployeeName", sType: 'string' },
            { mData: "JoinDate", oData: "JoinDate", render: renderDate, sType: 'string' },
            {
                mData: 'EmployeeId', oData: 'EmployeeId', sType: 'numeric', render: function (data, type, full) {
                    return '<a href="GetClientReport(' + full.EmployeeId + ')">download document</a>';
                }
            },
            { mData: "Height", oData: "Height", sType: 'string' },
            { mData: "Weight", oData: "Weight", sType: 'string' },
            { mData: 'Department.DepartmenName', oData: 'Department/DepartmenName', sType: 'string' },
            {
                mData: 'EmployeeId', oData: 'EmployeeId', sType: 'numeric', render: function (data, type, full) {
                    return '<a href="editRow(' + full.EmployeeId + ')" data-toggle="modal" data-target="#myModalEdit">Update</a>' +
                        ' | ' +
                        '<a href="deleteRow(' + full.EmployeeId + ')">Delete</a>';
                }
            }
        ],
        "fnServerData": fnServerOData,
        "bServerSide": true,
        "iODataVersion": 3,
        "searchable": false
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