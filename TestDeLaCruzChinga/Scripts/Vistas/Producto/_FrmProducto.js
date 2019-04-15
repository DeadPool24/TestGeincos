$(document).ready(function () {
    $("#btn-Presentacion").click(function () {
        GetTipoUnidadMedida();
        $("#Md-Unidad").modal('show');
    })
    $("#btn-Registrar").click(function () {
        AddProducto();
    })
    $("#btn-NuevaCategoria").click(function () {
        $("#FrmCategoria")[0].reset();
        $("#Md-Categoria").modal('show');
        flag = true;
    })

    $("#btn-EditarCategoria").click(function () {
        $("#FrmCategoria")[0].reset();
        var id = $("#cmb-Categoria").val();
        GetIdCategoria(id);
        flag = false;
    })
    $("#cmb-Familia").change(function () {
        var id = document.getElementById("cmb-Familia").value;
        GetLineaPorFamilia(id, "");
    })
})


function AddProducto() {
    var url = "";
    var params = {};

    var EnKardex = "N";
    var AfectoIgv = "N";
    var Estado = "D";
    if (document.getElementById("chk-DescontarStock").checked == true)
        EnKardex = "S";
    if (document.getElementById("chk-Estado").checked == true)
        Estado = "H";
    if (flagMant == false) {
        url = 'AddProducto';
        params = {
            SubCodigo: $("#txt-SubCodigo").val(),
            Descripcion: $("#txt-Descripcion").val(),
            IdCategoria: $("#cmb-Categoria").val(),
            PVenta: $("#txt-PVenta").val(),
            Estado: Estado,
            IdTipoUnidadMedida: $("#H-IdTipoUnidadMedida").val(),
            UltimoPCompra: $("#txt-PCompra").val(),
            EnKardex: EnKardex,
            AfectoIgv: $("#cmb-Afectacion").val()
        };
    }
    else {
        url = 'updateProducto';
        params = {
            CodigoProducto: $("#H-CodigoProducto").val(),
            SubCodigo: $("#txt-SubCodigo").val(),
            Descripcion: $("#txt-Descripcion").val(),
            IdCategoria: $("#cmb-Categoria").val(),
            PVenta: $("#txt-PVenta").val(),
            Estado: Estado,
            IdTipoUnidadMedida: $("#H-IdTipoUnidadMedida").val(),
            UltimoPCompra: $("#txt-PCompra").val(),
            EnKardex: EnKardex,
            AfectoIgv: $("#cmb-Afectacion").val()
        };
    }

    if (validarForm() == false)
        return;
    $("#loading").modal('show');

    $.ajax({
        url: url,
        dataType: 'json',
        type: 'post',
        data: params,
        success: function (a) {
            console.log(a);
            if (a.Codigo == 0) {
                swal({
                    title: "Fantástico!!",
                    text: a.Mensaje,
                    icon: "success",
                    button: "Continuemos!",
                });
                FillProducto();
                $("#loading").modal('hide');
                $("#Md-Mantenimiento").modal('hide');
            }
            else {
                swal({
                    title: "Uppss!!",
                    text: a.Mensaje,
                    icon: "warning",
                    button: "ok!",
                });
            }
        },
        error: function (x) {
            console.log(x);
        },
        complete: function () {

        }
    })
}

function DeleteProducto(id) {
    var codigo = $("#prod-" + id).data("codigo");
    swal({
        title: "¿Esta seguro de eliminar el producto?",
        text: "El producto sera desactivado de la lista de Habilitados!",
        icon: "warning",
        buttons: true,
        dangerMode: true,
    })
.then((willDelete) => {
    if (willDelete) {
        $.ajax({
            url: 'DeleteProducto',
            dataType: 'json',
            type: 'post',
            data: { CodigoProducto: codigo },
            success: function (a) {
                if (a.Codigo == 0) {
                    swal(a.Mensaje, {
                        icon: "success",
                    });
                    FillProducto();
                }
                else {
                    swal({
                        title: "Ocurrio un Erro!",
                        text: a.Mensaje,
                        icon: "warning",
                        button: "ok!",
                    });
                }
            },
            error: function (x) {
                console.log(x);
            },
            complete: function () {
            }
        })

    }
});
}



function validarForm() {

    if ($("#txt-Descripcion").val() == "") {
        Mensaje("Falta la descripcion del Producto");
        return false;
    }
    if ($("#cmb-Categoria").val() == "0" || $("#cmb-Categoria").val() == null) {
        Mensaje("Falta la categoria del Producto");
        return false;
    }
    if ($("#txt-Presentacion").val() == "") {
        Mensaje("Falta la presentacion del Producto");
        return false;
    }
    if ($("#txt-PCompra").val() < 0) {
        Mensaje("El precio de compra no debe ser negativo");
        return false;
    }

    if ($("#txt-PVenta").val() <= 0) {
        Mensaje("El precio de venta no debe ser menor a cero");
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