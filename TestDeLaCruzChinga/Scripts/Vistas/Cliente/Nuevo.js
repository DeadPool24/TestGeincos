var Flag = true;
var idcliente;
$(document).ready(function () {
    $("#mCli").addClass("active");
    $("#btnNuevo").click(function () {
        $("#md-Nuevo").modal('show');
        $("#titleModal").empty();
        $("#titleModal").append("Nuevo Cliente <i class='fa fa-user-plus'></i>");
        $("#FormDatos")[0].reset();
        HideOrShow(1);
    })
    GetCliente();

    $("#cmb-Documento").change(function () {
        $("#txt-Nombres").val('');
        $("#txt-ApellidoP").val('');
        $("#txt-ApellidoM").val('');
        $("#txt-Direccion").val('');
        HideOrShow($(this).val());
        Flag = true;
    })

    $("#txt-Valor").keypress(function () {
        if (event.keyCode == 13) {
            GetCliente();
        }
    })

    $("#btnBuscar").click(function () {
        GetCliente();
    })

})

function GetCliente() {
    var _Body = "";
    $("#loading").modal('show');
    $.ajax({
        url: '/Cliente/GetCliente',
        dataType: 'json',
        type: 'post',
        data: { cliente: $("#txt-Valor").val() },
        success: function (a) {
            console.log(a);
            if (a.Codigo == 0) {
                $.each(a.Data, function (i, v) {
                    var SecondName, NumberPhone;
                    if (v.NombreComercial != "")
                        SecondName = v.Nombres;
                    else
                        SecondName = v.Nombres + ' ' + v.ApellidoP + ' ' + v.ApellidoM;
                    //_Body += '<div class="col-md-11 col-sm-10 col-xs-10">';
                    //_Body += '<div class="panel panel-default cssClientes">';
                    //_Body += '<div class="panel-body">';
                    //_Body += '<div class="col-md-4 col-sm-12 col-xs-12" style="padding-right:0px; padding-left:0px;">';
                    //_Body += '<i class="fa fa-user"></i> ' + SecondName;
                    //_Body += '</div>';
                    //_Body += '<div class="col-md-2 col-sm-6 col-xs-12" style="padding-right:0px; padding-left:0px;">';
                    //_Body += '<i class="fa fa-id-card-o"></i> ' + v.NomenclaturaDocumento + ': ' + v.NumDocIdentidad;
                    //_Body += '</div>';
                    //_Body += '<div class="col-md-3 col-sm-6 col-xs-12" style="padding-right:0px;padding-left:0px; width:24%;">';
                    //if (v.TelMovil != "")
                    //    _Body += '<i class="fa fa-mobile"></i>' + v.TelMovil;
                    //if (v.Telefono != "")
                    //    _Body += ' <i class="fa fa-phone"></i> ' + v.Telefono;
                    //_Body += '</div>';
                    //_Body += '<div class="col-md-3 col-sm-12 col-xs-12" style="padding-right:0px; padding-left:0px;">';
                    //if (v.Email != '')
                    //    _Body += '<b>@</b>' + v.Email;
                    //_Body += '</div>';
                    //_Body += '</div>';
                    //_Body += '</div>';
                    //_Body += '</div>';
                    //_Body += '<div class="col-md-1 col-sm-2 col-xs-2">';
                    //_Body += '<div class="btn-group-vertical btn-group-sm">';
                    //_Body += '<i class="btn btn-danger btn-xs fa fa-trash-o"  onclick="DeleteShow(' + v.IdCliente + ')"></i> ';
                    //_Body += '<i class="btn btn-default btn-xs fa fa-pencil" onclick="EditShow(' + v.IdCliente + ')"></i> ';
                    //_Body += '</div>';
                    //_Body += '</div>';
                    _Body += '<tr style="font-size:small">';
                    _Body += '<td>' + SecondName + '</td>';
                    _Body += '<td>' + v.NomenclaturaDocumento + '</td>';
                    _Body += '<td>' + v.NumDocIdentidad + '</td>';
                    _Body += '<td>';
                    if (v.TelMovil != "")
                        _Body += v.TelMovil;
                    if (v.Telefono != "")
                        _Body += ' - ' + v.Telefono;
                    _Body += '</td>';
                    _Body += '<td>' + v.Email + '</td>';
                    _Body += '<td><i class="btn btn-danger btn-xs fa fa-trash-o"  onclick="DeleteShow(' + v.IdCliente + ')"></i></td>';
                    _Body += '<td><i class="btn btn-default btn-xs fa fa-pencil" onclick="EditShow(' + v.IdCliente + ')"></i></td>';
                    _Body += '</tr>';


                })
                $("#bodyCliente").empty();
                $("#bodyCliente").append(_Body);
                $("#total-Clientes").text(a.Data.length + " registros");
                $("#td-Clientes").fancyTable({
                    sortColumn: 0,
                    pagination: true,
                    perPage: 10,
                    globalSearch: false,
                    searchable: false,
                    sortable: false,
                    paginationClass: "btn btn-success"
                });
                $("#loading").modal('hide');
            }
            else {
                swal({
                    title: "No hay Clientes registrados",
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

function EditShow(i) {
    $("#md-Nuevo").modal('show');
    $("#titleModal").empty();
    $("#titleModal").append("Editar Cliente <i class='fa fa-user-circle-o'></i>");
    Flag = false;
    $.ajax({
        url: '/Cliente/FillCliente',
        dataType: 'json',
        type: 'post',
        data: { op: 1, valor: i },
        success: function (a) {
            if (a.Codigo == 0) {
                idcliente = i;
                $("#txt-Nombres").val(a.Data[0].Nombres);
                $("#txt-ApellidoP").val(a.Data[0].ApellidoP);
                $("#txt-ApellidoM").val(a.Data[0].ApellidoM);
                $("#txt-Direccion").val(a.Data[0].Direccion);
                $("#cmb-Documento").val(a.Data[0].idTipoDocIdent);
                $("#txt-numeroDoc").val(a.Data[0].NumDocIdentidad);
                $("#txt-Email").val(a.Data[0].Email);
                $("#txt-Telefono").val(a.Data[0].Telefono);
                $("#txt-Celular").val(a.Data[0].TelMovil);
                HideOrShow(a.Data[0].idTipoDocIdent);
            }
        },
        error: function (x) {
            console.log(x);
        },
        complete: function () {
        }
    })
}

function DeleteShow(i) {
    swal({
        title: "¿Esta seguro de eliminar al cliente?",
        text: "tras ser eliminado ya no podra recuperarse el registro!",
        icon: "warning",
        buttons: true,
        dangerMode: true,
    })
.then((willDelete) => {
    if (willDelete) {
        $.ajax({
            url: '/Cliente/DeleteCliente',
            dataType: 'json',
            type: 'post',
            data: { IdCliente: i },
            success: function (a) {
                if (a.Codigo == 0) {
                    swal(a.Mensaje, {
                        icon: "success",
                    });
                    GetCliente();
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

function AddCliente() {
    var url = "";
    if (validarForm() == false)
        return;
    if (Flag == true)
        url = '/Cliente/AddCliente'
    else
        url = '/Cliente/UpdateCliente';
    $("#loading").modal('show');

    $.ajax({
        url: url,
        dataType: 'json',
        type: 'post',
        data: {
            nombres: $("#txt-Nombres").val(),
            apellidop: $("#txt-ApellidoP").val(),
            apellidom: $("#txt-ApellidoM").val(),
            direccion: $("#txt-Direccion").val(),
            nombrecomercial: $("#txt-ApellidoP").val(),
            idtipodoc: $("#cmb-Documento").val(),
            numerodoc: $("#txt-numeroDoc").val(),
            email: $("#txt-Email").val(),
            telefono: $("#txt-Telefono").val(),
            celular: $("#txt-Celular").val(),
            idCliente: idcliente
        },
        success: function (a) {
            console.log(a);
            if (a.Codigo == 0) {
                if (Fcliente == true) {
                    $("#txt-NumDocIdentidad").val($("#txt-numeroDoc").val());
                    $("#txt-Cliente").val($("#txt-Nombres").val() + ' ' + $("#txt-ApellidoP").val() + ' ' + $("#txt-ApellidoM").val());
                    $("#txt-IdCliente").val(a.Id);
                    $("#txt-TipoDocumento").val($("#cmb-Documento").val() == 1 ? "Reg. unico de contribuyente" : "Doc. Nacional de Identidad");
                }
                GetCliente();
                swal({
                    title: "Operacion Exitosa",
                    text: a.Mensaje,
                    icon: "success",
                    button: "Genial!",
                });
                $("#loading").modal('hide');
                $("#md-Nuevo").modal('hide');
            }
            else {
                swal({
                    title: "Error al Registrar Cliente",
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

function Consultar() {
    if ($("#cmb-Documento").val() == 1) {
        if ($.trim($("#txt-numeroDoc").val()).length != 8) {
            Mensaje("Longitud incorrecta de documento");
            return false;
        }
    }
    else {
        if ($.trim($("#txt-numeroDoc").val()).length != 11) {
            Mensaje("Longitud incorrecta de documento");
            return false;
        }
    }

    $("#loading").modal('show');
    $.ajax({
        url: '/Cliente/ConsultarSunat',
        dataType: 'json',
        type: 'post',
        data: { Ruc: $("#txt-numeroDoc").val() },
        success: function (a) {
            console.log(a);
            if (a.Codigo == 0) {
                if (a.Data.Error == null) {
                    if ($("#cmb-Documento").val() == 1) {
                        $("#txt-Nombres").val(a.Data.nombres);
                        $("#txt-ApellidoP").val(a.Data.apellido_paterno);
                        $("#txt-ApellidoM").val(a.Data.apellido_materno);
                    }
                    else {
                        $("#txt-Nombres").val(a.Data.razon_social);
                        $("#txt-ApellidoP").val(a.Data.nombre_comercial);
                        $("#txt-Direccion").val(a.Data.domicilio_fiscal);
                    }
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


function validarForm() {

    if ($("#txt-numeroDoc").val() == "") {
        Mensaje("Ingrese el numero de documento");
        return false;
    }
    if ($("#cmb-Documento").val() == 1) {
        if ($.trim($("#txt-numeroDoc").val()).length != 8) {
            Mensaje("Longitud incorrecta de documento");
            return false;
        }
    }
    else {
        if ($.trim($("#txt-numeroDoc").val()).length != 11) {
            Mensaje("Longitud incorrecta de documento");
            return false;
        }
    }
    if ($("#txt-Nombres").val() == "") {
        Mensaje("Ingrese el nombre o razon social ");
        return false;
    }
    if ($("#cmb-Documento").val() == 1) {
        if ($("#txt-ApellidoP").val() == "") {
            Mensaje("Ingrese el Apellido paterno");
            return false;
        }
        if ($("#txt-ApellidoM").val() == "") {
            Mensaje("Ingrese el Apellido Materno");
            return false;
        }
    }
    if ($("#txt-Email").val() != "") {
        if (validar_email($("#txt-Email").val()) == false) {
            Mensaje("Correo Electronico Incorrecto");
            return false;
        }
    }
    return true;
}

function Mensaje(mensaje) {
    swal({
        title: "Uppsss! Faltan Datos",
        text: mensaje,
        icon: "warning",
        button: "Entendido!",
    });
}

function validar_email(email) {
    var regex = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    return regex.test(email) ? true : false;
}

function HideOrShow(TipoDoc) {
    if (TipoDoc == "1") {
        $("#titleNombres").empty();
        $("#titleNombres").append("Nombres");
        $("#col-ApellidoM").removeClass('hide');
        $("#col-ApellidoP").removeClass('col-md-12');
        $("#col-ApellidoP").addClass('col-md-6');
        $("#titleApellidoP").empty();
        $("#titleApellidoP").append("Apellido Paterno");

    }
    else {

        $("#titleNombres").empty();
        $("#titleNombres").append("Razon Social");
        $("#col-ApellidoM").addClass('hide');
        $("#col-ApellidoP").removeClass('col-md-6');
        $("#col-ApellidoP").addClass('col-md-12');
        $("#titleApellidoP").empty();
        $("#titleApellidoP").append("Nombre Comercial");
    }


}