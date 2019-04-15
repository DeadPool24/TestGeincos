$(document).ready(function () {
    $("#btnNuevo").click(function () {
        $("#Md-Mantenimiento").modal('show');
        $("#FrmProducto")[0].reset();
        GetCategoria();
        flagMant = false;
    })
    FillProducto();
    $("#btnBuscar").click(function () {
        FillProducto();
    });
    $("#txt-Valor").keypress(function () {
        if (event.keyCode == 13) {
            FillProducto();
        }
    })
})

function FillProducto() {
    $("#loading").modal('show');
    var _Body = "";
    $.ajax({
        url: 'FillProducto',
        dataType: 'json',
        type: 'post',
        data: {
            Descripcion: $("#txt-Valor").val(),
            Tipo: '1',
            Estado: 'H',
            CodEstablecimiento: CodAlmacen,
            IdMarca: '1',
            stock: '0'
        },
        success: function (a) {
            console.log(a);
            if (a.Codigo == 0) {
                $.each(a.Data, function (i, v) {
                    _Body += '<div class="col-md-3">';
                    _Body += '<div class="col-md-10 col-sm-10 col-xs-10" style="padding-right: 0px;">';
                    _Body += '<div class="panel panel-default css">';
                    _Body += '<div class="panel-body">';
                    _Body += '<div class="col-md-12">';
                    _Body += '<b id="prod-' + i + '" data-codigo="' + $.trim(v.CodigoProducto) + '">' + $.trim(v.CodigoProducto) + ' - ' + v.Descripcion + '</b>';
                    _Body += '</div>';
                    _Body += '<div class="col-md-6">';
                    _Body += '<b> P. Compra:</b> ' + v.UltimoPCompra;
                    _Body += '</div>';
                    _Body += '<div class="col-md-6">';
                    _Body += '<b> P. Venta:</b> ' + v.PVenta;
                    _Body += '</div>';
                    _Body += '<div class="col-md-12">';
                    _Body += '<b>Stock:</b> ' + v.stock + ' ' + v.TipoUnidadMedida;
                    _Body += '</div>';
                    _Body += '<div class="col-md-12">';
                    _Body += '</div>';
                    _Body += '</div>';
                    _Body += '</div>';
                    _Body += '</div>';
                    _Body += '<div class="col-md-2 col-sm-2 col-xs-2" style="padding-left: 0px;">';
                    _Body += '<div class="btn-group-vertical btn-group-sm">';
                    _Body += '<button class="btn btn-success btn-sm" style="font-size:x-small; height:50px;" onclick="GetIdProducto(' + i + ')"><i class="fa fa-pencil"></i></button>';
                    _Body += '<button class="btn btn-danger  btn-sm" style="font-size:x-small; height:50px;" onclick="DeleteProducto(' + i + ')"><i class="fa fa-trash"></i></button>';
                    _Body += '</div>';
                    _Body += '</div>';
                    _Body += '</div>';
                })
                $("#_Body").empty();
                $("#_Body").append(_Body);
                $("#loading").modal('hide');
            }
            else {
                swal({
                    title: "Uppss!!Ocurrió Álgo.",
                    text: a.Mensaje,
                    icon: "warning",
                    button: "ok!",
                });
                $("#loading").modal('hide');
            }
        },
        error: function (x) {

        },
        complete: function () {

        }
    })
}

function GetIdProducto(id) {
    flagMant = true;
    var codigo = $("#prod-" + id).data("codigo");
    GetCategoria();
    $("#loading").modal('show');
    var _Body = "";
    $.ajax({
        url: 'GetIdProducto',
        dataType: 'json',
        type: 'post',
        data: {
            Codigo: codigo
        },
        success: function (a) {
            console.log(a);
            if (a.Codigo == 0) {
                $("#loading").modal('hide');
                $("#H-CodigoProducto").val(codigo);
                $("#txt-Descripcion").val(a.Data[0].Descripcion);
                $("#cmb-Categoria").val(a.Data[0].IdCategoria);
                $("#txt-SubCodigo").val($.trim(a.Data[0].SubCodigo));
                $("#txt-Presentacion").val(a.Data[0].TipoUnidadMedida);
                $("#txt-PCompra").val(a.Data[0].UltimoPCompra);
                $("#txt-PVenta").val(a.Data[0].PVenta);
                $("#H-IdTipoUnidadMedida").val(a.Data[0].IdTipoUnidadMedida);
                $("#cmb-Afectacion").val(a.Data[0].AfectoIgv);
                if ($.trim(a.Data[0].EnKardex) == "S")
                    document.getElementById("chk-DescontarStock").checked = true;
                else
                    document.getElementById("chk-DescontarStock").checked = false;
                if ($.trim(a.Data[0].Estado) == "H")
                    document.getElementById("chk-Estado").checked = true;
                else
                    document.getElementById("chk-Estado").checked = false;
                $("#Md-Mantenimiento").modal('show');
            }
            else {
                swal({
                    title: "Uppss!!Ocurrió Álgo.",
                    text: a.Mensaje,
                    icon: "warning",
                    button: "ok!",
                });
                $("#loading").modal('hide');
            }
        },
        error: function (x) {

        },
        complete: function () {

        }
    })
}