$(document).ready(function () {
    FillOperacionesFecha();
    $("#btnNuevo").click(function () {
        $("#titleModal").text("Nueva operación");
        GetAllTipoOperaciones();
        $("#md-Nuevo").modal('show');
    })
    $("#btnBuscar").click(function () {
        FillOperacionesFecha();
    })
})
function GetAllTipoOperaciones() {
    ShowLoader(1);
    var body = '<option value="0">--Seleccione Operacion--</option>';
    $("#cmb-TipoOperacion").empty();
    $.ajax({
        url: '/Caja/GetAllTipoOperaciones',
        dataType: 'json',
        type: 'post',

        success: function (a) {
            if (a.Codigo == 0) {
                $.each(a.Data, function (i, v) {
                    body += '<option value="' + v.CodigoTipoOperacion + '" id="op-' + v.CodigoTipoOperacion + '" data-tipo="' + v.Tipo + '">' + v.NombreTipoOperacion + '</option>';
                })
                $("#cmb-TipoOperacion").append(body);
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

function FillOperacionesFecha() {
    var totalI = 0, totalE = 0;
    ShowLoader(1);
    var body = "";
    $("#cmb-TipoOperacion").empty();
    $.ajax({
        url: '/Caja/FillOperaciones',
        dataType: 'json',
        type: 'post',
        data: { desde: $("#text-Desde").val(), hasta: $("#text-Hasta").val(), concepto: $("#txt-Valor").val() },
        success: function (a) {
            if (a.Codigo == 0) {
                $.each(a.Data, function (i, v) {
                    body += '<tr>';
                    body += '<td>' + v.ID + '</td>';
                    body += '<td>' + v.Concepto + '</td>';
                    body += '<td>' + v.Tipo + '</td>';
                    body += '<td>' + v.Monto + '</td>';
                    body += '<td>' + v.TipoOperacion + '</td>';
                    body += '<td>EN EFECTIVO</td>';
                    body += '<td>' + v.Registro + '</td>';
                    body += '<td>' + v.CajaBanco + '</td>';
                    body += '<td>';
                    body += '<div class="btn-group">';
                    body += '<button class="btn btn-default btn-xs dropdown-toggle"';
                    body += 'type="button" data-toggle="dropdown">';
                    body += '<span class="fa fa-cog"></span>';
                    body += '</button>';
                    body += '<ul class="dropdown-menu pull-right small">';
                    body += '<li><a href="#">Anular</a></li>';
                    body += '<li><a href="#">Modificar</a></li>';
                    body += '<li><a href="#">Detalle</a></li>';
                    body += '</ul>';
                    body += '</div>';
                    body += '</td>';
                    body += '</tr>';
                    if (v.Tipo == "INGRESO")
                        totalI += v.Monto;
                    else
                        totalE += v.Monto;
                })
                $("#_bodyOperaciones").empty();
                $("#_bodyOperaciones").append(body);
                $("#total-Ingresos").text(totalI.toFixed(2));
                $("#total-Egresos").text(totalE.toFixed(2));
                $("#total-Diferencia").text((totalI - totalE).toFixed(2));
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

function changeFunc(i) {
    var selectBox = document.getElementById("cmb-TipoOperacion");
    var selectedValue = selectBox.options[selectBox.selectedIndex].value;
    var tipo = $("#op-" + i).data("tipo");
    if (tipo == "I")
        document.getElementById("text-Tipo").value = "INGRESO";
    else
        document.getElementById("text-Tipo").value = "EGRESO";
    console.log(tipo);
}

function AddOperaciones() {
    ShowLoader(1);
    $.ajax({
        url: '/Caja/AddOperaciones',
        dataType: 'json',
        type: 'post',
        data: {
            IdTipoOperacion: $("#cmb-TipoOperacion").val(),
            Concepto: $("#text-Concepto").val(),
            Tipo: $("#text-Tipo").val(),
            monto: $("#text-Monto").val(),
            FechaOperacion: $("#text-Fecha").val(),
            documento: $("#text-Documento").val(),
            NroOperacion: $("#text-Operacion").val()
        },
        success: function (a) {
            if (a.Codigo == 0) {
                MensajeOK(a.Mensaje, "", "");
                $("#md-Nuevo").modal('hide');
                FillOperacionesFecha();
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

