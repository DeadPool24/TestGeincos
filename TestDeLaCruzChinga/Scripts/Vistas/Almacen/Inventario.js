var Flag = 0;
$(document).ready(function () {
    $("#btnPdf").attr("href", "PrintInventario?op=1");
    $("#btnExcel").attr("href", "PrintInventario?op=2");
    $("#btnWord").attr("href", "PrintInventario?op=3");
    $("#btn-Buscar3").click(function () {
        GetProductosInventario();
    })
    $("#btn-GuardarInventario").click(function () {
        AddRemove();
    })
    $("#txt-Valor2").keypress(function () {
        if (event.keyCode == 13) {
            GetProductosInventario();
        }
    })

    $("#txt-Cantidad").keyup(function () {
        var mensaje = "";
        var cantidad = 0;
        $("#lbl-Mensaje").empty();
        if (Flag == 1)
            mensaje = ' Se registrarán  ' + $(this).val() + ' - ' + $("#txt-Unidad").val();
        else if (Flag == 2)
            mensaje = ' Se Moverán  ' + $(this).val() + ' - ' + $("#txt-Unidad").val();
        else if (Flag == 3) {
            if (parseFloat($(this).val()) - parseFloat($("#txt-Stock").val()) > 0) {
                cantidad = parseFloat($(this).val()) - parseFloat($("#txt-Stock").val());
                mensaje = 'Se Agregarán  ' + cantidad + ' ' + $("#txt-Unidad").val();
            }
            else {
                cantidad = parseFloat($("#txt-Stock").val()) - parseFloat($(this).val());
                mensaje = 'Se Quitarán  ' + cantidad + ' ' + $("#txt-Unidad").val();
            }
        }
        $("#lbl-Mensaje").append(mensaje);
    })

})


function showModal(v, f) {
    Flag = f;
    $("#lbl-Mensaje").empty();
    $("#md-Cantidad-title").empty();
    if (f == 1)
        $("#md-Cantidad-title").append("Registro de STOCK");
    else if (f == 2)
        $("#md-Cantidad-title").append("Descuento de STOCK");
    else if (f == 3)
        $("#md-Cantidad-title").append("Ajuste de STOCK");
    $("#frm-Inventario")[0].reset();
    $("#lbl-Producto").empty();
    $("#lbl-Producto").append($("#prod-" + v).data("nombre"));
    $("#txt-CodigoProducto").val($("#prod-" + v).data("codigo"));
    $("#txt-Unidad").val($("#prod-" + v).data("unidad"));
    $("#txt-PCompra").val($("#prod-" + v).data("pcompra"));
    $("#txt-Stock").val($("#prod-" + v).data("stock"));
    $("#md-Cantidad").modal('show');
}



function AddRemove() {
    var cantidad = $("#txt-Cantidad").val();
    var url = "";
    if (Flag == 1)
        url = 'AjustarEntrada';
    else
        url = 'AjustarSalida';

    if (Flag == 3) {
        if (parseFloat($("#txt-Cantidad").val()) - parseFloat($("#txt-Stock").val()) > 0) {
            url = 'AjustarEntrada';
            cantidad = parseFloat($("#txt-Cantidad").val()) - parseFloat($("#txt-Stock").val());
        }
        else {
            url = 'AjustarSalida';
            cantidad = parseFloat($("#txt-Stock").val()) - parseFloat($("#txt-Cantidad").val());
        }
    }
    if (!validarForm())
        return;
    $("#loading").modal('show');
    $.ajax({
        url: url,
        dataType: 'json',
        type: 'post',
        data: {
            CANT: cantidad,
            CodProducto: $("#txt-CodigoProducto").val(),
            UnidadMedida: $("#txt-Unidad").val(),
            PCompra: $("#txt-PCompra").val()
        },
        success: function (a) {
            console.log(a);
            if (a.Codigo == 0) {
                GetProductosInventario();
                $("#loading").modal('hide');
                $("#md-Cantidad").modal('hide');
                swal({
                    title: "Fantástico!!",
                    text: a.Mensaje,
                    icon: "success",
                    button: "Continuemos!",
                });
            }
            else {
                $("#loading").modal('hide');
                $("#md-Cantidad").modal('hide');
                swal({
                    title: "Uppss!!Ocurrió Álgo.",
                    text: a.Mensaje,
                    icon: "warning",
                    button: "ok!",
                });
            }
        },
        error: function (x) {
            console.log(x);
            $("#loading").modal('hide');
        },
        complete: function () {
        }
    })
}

function GetProductosInventario() {
    $("#loading").modal('show');
    var _Body = "";
    $.ajax({
        url: '/Producto/GetProductosInvColumns',
        dataType: 'json',
        type: 'post',
        data: { descripcion: $("#txt-Valor2").val(), idCategoria: 0 },
        success: function (a) {
            console.log(a);
            if (a.Codigo == 0) {
                $.each(a.Data, function (i, v) {
                    _Body += '<div class="col-md-3 col-sm-3 col-sx-12">';
                    _Body += '<div class="col-md-10 col-sm-10 col-xs-10" style="padding-right: 0px;">';
                    _Body += '<div class="panel panel-default css">';
                    _Body += '<div class="panel-body">';
                    _Body += '<div class="col-md-12 col-sm-12 col-xs-12">';
                    _Body += '<b id="prod-' + i + '" data-stock="' + v.stock + '" data-pcompra="' + v.UltimoPCompra + '" data-unidad="' + v.TipoUnidadMedida + '" data-nombre="' + v.Descripcion + '" data-codigo="' + $.trim(v.CodigoProducto) + '">' + $.trim(v.CodigoProducto) + ' - ' + v.Descripcion + '</b>';
                    _Body += '</div>';
                    _Body += '<div class="col-md-12 col-sm-12 col-xs-12">';
                    _Body += '<b> P. Compra:</b> ' + v.UltimoPCompra;
                    _Body += '</div>';
                    _Body += '<div class="col-md-12 col-sm-12 col-xs-12">';
                    _Body += '<b>Stock:</b> ' + v.stock + ' ' + v.TipoUnidadMedida;
                    _Body += '</div>';
                    _Body += '<div class="col-md-12 col-sm-12 col-xs-12">';
                    _Body += '</div>';
                    _Body += '</div>';
                    _Body += '</div>';
                    _Body += '</div>';
                    _Body += '<div class="col-md-2 col-sm-2 col-xs-2" style="padding-left: 0px;">';
                    _Body += '<div class="btn-group-vertical btn-group-sm">';
                    _Body += '<button class="btn btn-success btn-sm" title="agregar" style="font-size:x-small; height:34px;" onclick="showModal(' + i + ',1)"><i class="fa fa-plus"></i></button>';
                    _Body += '<button class="btn btn-danger  btn-sm" title="quitar"  style="font-size:x-small; height:33px;" onclick="showModal(' + i + ',2)"><i class="fa fa-minus"></i></button>';
                    _Body += '<button class="btn btn-warning  btn-sm" title="ajustar"  style="font-size:x-small; height:33px;" onclick="showModal(' + i + ',3)"><i class="fa fa-cog"></i></button>';
                    _Body += '</div>';
                    _Body += '</div>';
                    _Body += '</div>';
                })
                $("#_BodyInventario").empty();
                $("#_BodyInventario").append(_Body);
                $("#loading").modal('hide');

            }
            else {
                $("#loading").modal('hide');
                swal({
                    title: "Uppss!!Ocurrió Álgo.",
                    text: a.Mensaje,
                    icon: "warning",
                    button: "ok!",
                });
            }
        },
        error: function (x) {
            console.log(x);
            $("#loading").modal('hide');
        },
        complete: function () {
        }
    })
}

function validarForm() {

    if ($("#txt-Cantidad").val() == "") {
        Mensaje("Ingrese la cantidad");
        return false;
    }


    return true;
}

function Mensaje(mensaje) {
    swal({
        title: "Uppsss! Revisa la info!!",
        text: mensaje,
        icon: "warning",
        button: "Entendido! :C",
    });
}