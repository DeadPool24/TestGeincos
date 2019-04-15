$(document).ready(function () {
    GetCajaChica();
})

function GetCajaChica() {
    ShowLoader(1);
    var body = "";
    $("#cmb-CajaBanco").empty();
    $.ajax({
        url: '/Caja/GetCajaChica',
        dataType: 'json',
        type: 'post',
        success: function (a) {
            if (a.Codigo == 0) {
                $.each(a.Data, function (i, v) {
                    body += '<option value="' + v.IdCajaChica + '">Caja Chica: 00' + v.IdCajaChica + " - " + v.NombreMoneda + '</option>';
                })
                $("#cmb-CajaBanco").append(body);
                Operaciones();
                ShowLoader(0);
            }
            else {
                MensajeError(a.Mensaje, "", "");
                ShowLoader(0);
            }
        },
        error: function (x) {
            console.log(x);
            ShowLoader(0);
        },
        complet: function () {
            ShowLoader(0);
        }
    })
}

function Operaciones() {
    ShowLoader(1);
    var body = "";
    $("#_bodyOperaciones").empty();
    $.ajax({
        url: '/Caja/Operaciones',
        dataType: 'json',
        type: 'post',
        data: { IdCajaChica: $("#cmb-CajaBanco").val() },
        success: function (a) {
            if (a.Codigo == 0) {
                $.each(a.Data, function (i, v) {
                    if (v.Tipo == "E") {
                        body += '<tr style="color:red">';
                    }
                    else
                        body += '<tr>';
                    body += '<td>' + v.IdOperacion + '</td>';
                    body += '<td>' + v.Concepto + '</td>';
                    if (v.Tipo == "E") {
                        body += '<td>-' + v.Monto + '</td>';
                    }
                    else
                        body += '<td>' + v.Monto + '</td>';
                    body += '<td>' + v.NombreTipoOperacion + '</td>';
                    body += '<td>' + v.Documento + '</td>';
                    body += '<td>' + moment(v.FechaOperacion).format("DD-MM-YYYY") + '</td>';
                    body += '<td>' + moment(v.FechaRegistro).format("DD-MM-YYYY") + '</td>';

                    body += '</tr>';
                })
                $("#_bodyOperaciones").append(body);
                $("#td-Operaciones").fancyTable({
                    sortColumn: 0,
                    pagination: true,
                    perPage: 10,
                    globalSearch: false,
                    searchable: false,
                    sortable: false,
                    paginationClass: "btn btn-primary"
                });
                ShowLoader(0);
            }
            else {
                MensajeError(a.Mensaje, "", "");
                ShowLoader(0);
            }
        },
        error: function (x) {
            console.log(x);
            ShowLoader(0);
        },
        complet: function () {
            ShowLoader(0);
        }
    })
}