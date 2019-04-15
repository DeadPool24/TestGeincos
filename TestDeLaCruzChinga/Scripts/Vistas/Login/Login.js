$(document).ready(function () {
    $("#btn-BuscarAlmacen").click(function () {
        GetStatus();
    })
   
})
function pulsar(e) {
    tecla = (document.all) ? e.keyCode : e.which;
    return (tecla != 13);
}
function GetAlmacen() {
    var Body = "";
    $("#cmb-Establecimiento").empty();
    $.ajax({
        url: '/Usuario/GetAlmacenUsuario',
        dataType: 'json',
        type: 'post',
        data: { Usuario: $("#Usuario").val() },
        success: function (a) {
            console.log(a);
            if (a.Codigo == 0) {
                $.each(a.Data, function (i, v) {
                    Body += '<option value="' + v.CodigoAlmacen + '">' + v.NombreAlmacen + '</option>'
                })
                $("#cmb-Establecimiento").append(Body);
                $("#md-Almacen").modal('show');
            }
        },
        error: function (x) {
            console.log(x);
        },
        complete: function () {

        }
    })
}

function GetStatus() {
    var Body = "";
    $.ajax({
        url: '/Usuario/StatusLogin',
        dataType: 'json',
        type: 'post',
        data: { usuario: $("#Usuario").val(), clave: $("#text-Clave").val() },
        success: function (a) {
            console.log(a);
            if (a.Codigo == 0) {
                GetAlmacen();
            }
            else {
                swal({
                    title: "Acceso denegado",
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

