$.extend(true, $.fn.dataTable.defaults, {
    "order": [],
    "columnDefs": [
        { className: 'dt-body-center', orderable: false, targets: -1 },
        { width: "2%", orderable: false, targets: 0 }
    ]
});

$(document).ready(function () {
    //validate form
    $('.form_required').each(function () {
        $(this).validate({
            'ignore': [],
            'rules': {
                table_required: {
                    required: function () {
                        return !$('.table_required_data').DataTable().data().any();
                    }
                }
            },
            'messages': {
                table_required: {
                    required: "Required data detil"
                }
            },
            highlight: function (element, errorClass, validClass) {
                $(element).parents('.form-control').removeClass('has-success').addClass('has-error');
            },
            unhighlight: function (element, errorClass, validClass) {
                $(element).parents('.form-control').removeClass('has-error').addClass('has-success');
            },
            errorPlacement: function (error, element) {
                if (element.hasClass('select2') && element.next('.select2-container').length) {
                    error.insertAfter(element.next('.select2-container'));
                } else if (element.parent('.input-group').length) {
                    error.insertAfter(element.parent());
                }
                else if (element.prop('type') === 'radio' && element.parent('.radio-inline').length) {
                    error.insertAfter(element.parent().parent());
                }
                else if (element.prop('type') === 'checkbox' || element.prop('type') === 'radio') {
                    error.appendTo(element.parent().parent());
                }
                else {
                    error.insertAfter(element);
                }
            }
        });
    });

    $('.datepicker').datepicker({
        dateFormat: 'dd-mm-yy',
        showButtonPanel: true,
        changeMonth: true,
        changeYear: true
    }).on("change", function (e) {
        $(this).valid();
    });

    $('.datepicker').attr("autocomplete", "off");
});

function isEmptyString(str) {
    return ($.trim(str) === "");
}

function renderDate(data, type, val) {
    if (!isEmptyString(data)) {
        return data.substr(0, 10).split('-').reverse().join('-');
    }
    return '';
}

function renderDateInsert(data, type, val) {
    if (!isEmptyString(data)) {
        var split = [];
        split = data.substr(0, 10).split('-');
        result = split[1] + "-" + split[0] + "-" + split[2];
        return result;
    }
    return '';
}

function renderDateUpdate(data, type, val) {
    if (!isEmptyString(data)) {
        var split = [];
        split = data.substr(0, 10).split('-');
        result = split[2] + "-" + split[1] + "-" + split[0];
        return result;
    }
    return '';
}

function refreshTable(table, url, callback) {
    if (url) {
        var obj = table.dataTable().fnSettings();
        obj.sAjaxSource = url;
    }
    var dtable = table.dataTable({ bRetrieve: true });
    dtable._fnDraw();
}

function clearForm(form) {
    document.getElementById(form).reset();
    $("#" + form + " select").val(null).trigger('change');
    $("#" + form + "").validate().resetForm();
};