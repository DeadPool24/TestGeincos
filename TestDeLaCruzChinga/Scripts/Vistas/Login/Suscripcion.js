$(document).ready(function () {
    $("#btn-Ruc").click(function () {
        Consultar();
    })

    GetDepartamentos();
    $("#cmb-Departamento").change(function () {
        GetProvincias($(this).val(), 0);
    })
    $("#cmb-Provincia").change(function () {
        GetDistritos($("#cmb-Departamento").val(), $("#cmb-Provincia").val(), 0);
    })
})

function Consultar() {
    var doc = "";

    doc = $("#text-Ruc").val();
    if ($.trim($("#text-Ruc").val()).length != 11) {
        swal({
            title: "Error al obtener registros del API",
            text: "Longitud incorrecta de documento",
            icon: "warning",
            button: "ok!",
        });
        return false;
    }

    $("#loading").modal('show');
    $.ajax({
        url: '/Cliente/ConsultarSunat',
        dataType: 'json',
        type: 'post',
        data: { Ruc: doc },
        success: function (a) {
            console.log(a);
            if (a.Codigo == 0) {
                if (a.Data.Error == null) {
                    $("#text-razon").val(a.Data.razon_social);
                    $("#text-nombre").val(a.Data.nombre_comercial);
                    $("#text-direccion").val(a.Data.domicilio_fiscal);
                    $("#loading").modal('hide');
                }
                else {
                    swal({
                        title: "Error al obtener registros del API",
                        text: a._Error,
                        icon: "warning",
                        button: "ok!",
                    });
                }
            }
            else {
                swal({
                    title: "Error interno de SUNAT",
                    text: a.Mensaje,
                    icon: "warning",
                    button: "ok!",
                });
                $("#loading").modal('hide');
            }
        },
        error: function (x) {
            console.log(x);
            $("#loading").modal('hide');
        },
        complete: function () {
            $("#loading").modal('hide');
        }
    })
}

function GetDepartamentos() {
    $("#loading").modal('show');
    $("#cmb-Departamento").empty();
    var _body = "";
    _body = '<option value="N" selected>--Seleccione--</option>';
    $.ajax({
        url: '/Ubigeos/GetDepartamentos',
        dataType: 'json',
        type: 'post',
        success: function (a) {
            console.log(a);
            if (a.Codigo == 2)
                location.reload();
            if (a.Codigo == 0) {
                $.each(a.Data, function (i, v) {
                    _body += '<option value="' + v.CodDep + '">' + v.NombreUbigeo + '</option>';
                })
                $("#cmb-Departamento").append(_body);
                $("#loading").modal('hide');
            } else {
                swal({
                    title: "Uppss!!",
                    text: a.Mensaje,
                    icon: "warning",
                    button: "ok!",
                });
                $("#loading").modal('hide');
            }
        },
        complete: function (x) {
            console.log(x);
            $("#loading").modal('hide');
        },
        complete: function () {
        }
    })
}

function GetProvincias(coddep, codprov) {
    $("#loading").modal('show');
    $("#cmb-Provincia").empty();
    var _body = "";
    _body = '<option value="N" selected>--Seleccione--</option>';
    $.ajax({
        url: '/Ubigeos/GetProvincias',
        dataType: 'json',
        type: 'post',
        data: { coddep: coddep },
        success: function (a) {
            console.log(a);
            if (a.Codigo == 2)
                location.reload();
            if (a.Codigo == 0) {
                $.each(a.Data, function (i, v) {
                    if (codprov == v.CodProv)
                        _body += '<option value="' + v.CodProv + '" selected>' + v.NombreUbigeo + '</option>';
                    else
                        _body += '<option value="' + v.CodProv + '">' + v.NombreUbigeo + '</option>';
                })
                $("#cmb-Provincia").append(_body);
                $("#loading").modal('hide');
            } else {
                swal({
                    title: "Uppss!!",
                    text: a.Mensaje,
                    icon: "warning",
                    button: "ok!",
                });
                $("#loading").modal('hide');
            }
        },
        complete: function (x) {
            console.log(x);
            $("#loading").modal('hide');
        },
        complete: function () {
        }
    })
}

function GetDistritos(coddep, codprov, coddist) {
    $("#loading").modal('show');
    $("#cmb-Distrito").empty();
    var _body = "";
    _body = '<option value="N" selected>--Seleccione--</option>';
    $.ajax({
        url: '/Ubigeos/GetDistritos',
        dataType: 'json',
        type: 'post',
        data: { coddep: coddep, codprov: codprov },
        success: function (a) {
            console.log(a);
            if (a.Codigo == 2)
                location.reload();
            if (a.Codigo == 0) {
                $.each(a.Data, function (i, v) {
                    if (coddist == v.CodDist)
                        _body += '<option value="' + v.IdUbigeo + '" selected>' + v.NombreUbigeo + '</option>';
                    else
                        _body += '<option value="' + v.IdUbigeo + '">' + v.NombreUbigeo + '</option>';
                })
                $("#cmb-Distrito").append(_body);
                $("#loading").modal('hide');
            } else {
                swal({
                    title: "Uppss!!",
                    text: a.Mensaje,
                    icon: "warning",
                    button: "ok!",
                });
                $("#loading").modal('hide');
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

function AddEmpresa() {
    if (validarForm() == false)
        return;
    $("#loading").modal('show');
    $.ajax({
        url: '/Usuario/AddEmpresa',
        dataType: 'json',
        type: 'post',
        data: {
            NumeroDoc: $("#text-Ruc").val(),
            RazonSocial: $("#text-razon").val(),
            NombreComercial: $("#text-nombre").val(),
            Direccion: $("#text-direccion").val(),
            Representante: "",
            Email: $("#text-correoContribuyente").val(),
            Telefono: $("#text-telefono").val(),
            IdUbigeo: $("#cmb-Distrito").val(),
            Dni: $("#text-dni").val(),
            Contacto: $("#text-nombres").val(),
            Clave: $("#text-contraseña").val()
        },
        success: function (a) {
            console.log(a);
            if (a.Codigo == 2)
                location.reload();
            if (a.Codigo == 0) {
                swal({
                    title: "Felicidades Contribuyente!!",
                    text: a.Mensaje,
                    icon: "success",
                    button: "Genial!",
                }).then(() => {
                    location.href = "/usuario/login";
                });
                $("#loading").modal('hide');
            } else {
                swal({
                    title: "Uppss!!",
                    text: a.Mensaje,
                    icon: "warning",
                    button: "ok!",
                });
                $("#loading").modal('hide');
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
    if ($("#text-Ruc").val() == "") {
        Mensaje("Ingrese su numero de RUC");
        return false;
    }

    if ($.trim($("#text-Ruc").val()).length != 11) {
        swal({
            title: "Upps!",
            text: "Longitud incorrecta de documento",
            icon: "warning",
            button: "ok!",
        });
        return false;
    }
    if ($("#text-razon").val() == "") {
        Mensaje("Ingrese la razon social");
        return false;
    }
    if ($("#text-nombre").val() == "") {
        Mensaje("Ingrese su nombre comercial");
        return false;
    }
    if ($("#text-correoContribuyente").val() == "") {
        Mensaje("Ingrese el correo electronico");
        return false;
    }
    if (validar_email($("#text-correoContribuyente").val()) == false) {
        Mensaje("el correo ingresado no es valido");
        return false;
    }
    if ($("#text-direccion").val() == "") {
        Mensaje("Ingrese su direccion fiscal");
        return false;
    }
    if ($("#cmb-Departamento").val() == "N" || $("#cmb-Departamento").val() == 0 || $("#cmb-Departamento").val() == "") {
        Mensaje("Seleccione su distrito");
        return false;
    }
    if ($("#cmb-Provincia").val() == "N" || $("#cmb-Provincia").val() == 0 || $("#cmb-Provincia").val() == "") {
        Mensaje("Seleccione su distrito");
        return false;
    }
    if ($("#cmb-Distrito").val() == "N" || $("#cmb-Distrito").val() == 0 || $("#cmb-Distrito").val() == "") {
        Mensaje("Seleccione su distrito");
        return false;
    }
    if ($("#text-nombres").val() == "") {
        Mensaje("Ingrese el nombre del contacto");
        return false;
    }

    if ($("#text-telefono").val() == "") {
        Mensaje("Ingrese el telefono del contacto");
        return false;
    }
    if ($("#text-contraseña").val() == "") {
        Mensaje("Ingrese la contraseña");
        return false;
    }

    if ($("#text-contraseña").val().length < 5 || $("#text-contraseña").val().length > 10) {
        swal({
            title: "Error de contraseña",
            text: "La contraseña debe tener entre 5 y 10 caracteres",
            icon: "warning",
            button: "ok!",
        });
        return false;
    }

    if ($("#text-contraseñaR").val() == "") {
        Mensaje("Debe confirmar la contraseña ingresada");
        return false;
    }

    if ($("#text-contraseñaR").val() != $("#text-contraseña").val()) {
        Mensaje("Las contraseñas no coinciden");
        return false;
    }
    return true;
}

function Mensaje(mensaje) {
    swal({
        title: "Algo Salio Mal!",
        text: mensaje,
        icon: "warning",
        button: "Ok!",
    });
}

function validar_email(email) {
    var regex = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    return regex.test(email) ? true : false;
}