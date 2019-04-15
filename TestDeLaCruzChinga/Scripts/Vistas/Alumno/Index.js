var operacion = true;//VARIABLE GLOBAL QUE IDENTIFICA SI SE REGISTRA O ACTUALIZA UN REGISTRO DE ALUMNO (TRUE: NUEVO, FALSE: ACTUALIZADO)
$(document).ready(function () {
    $("#btnNuevo").click(function () {
        $("#md-Nuevo").modal('show');
        $("#titleModal").text('Registro de alumno nuevo');
        operacion = true;
        LimpiarForm();
    })
    MostrarAlumnos();
})

function AgregarAlumno() {
    if (ValidarDatos() != true)
        return;
    var url = operacion == true ? '/Alumno/AddAlumno' : '/Alumno/UpdateAlumno';//SE IDENTIFICA EL TIPO DE OPERACION SEGUN EL BOTON PRESIONADO
    var parametros = {};

    if (operacion == true) {//REGISTRO DE NUEVO ALUMNO
        parametros = {
            PNom: $("#text-Nombres").val(),
            PApePat: $("#text-Apepat").val(),
            PApeMat: $("#text-Apemat").val(),
            PDni: $("#text-Dni").val(),
            PMail: $("#text-Correo").val(),
            PApod: $("#text-Apoderado").val(),
            PDniApo: $("#text-DniApo").val(),
            PTelf: $("#text-Telf").val(),
            PNiv: $("#cmb-Nivel").val(),
            PSec: $("#cmb-Seccion").val()
        }
    }
    else {
        parametros = {//ACTUALIZACION DE ALUMNO - SE AGREGA EL PARAMETRO ID
            Id: $("#text-Id").val(),
            PNom: $("#text-Nombres").val(),
            PApePat: $("#text-Apepat").val(),
            PApeMat: $("#text-Apemat").val(),
            PDni: $("#text-Dni").val(),
            PMail: $("#text-Correo").val(),
            PApod: $("#text-Apoderado").val(),
            PDniApo: $("#text-DniApo").val(),
            PTelf: $("#text-Telf").val(),
            PNiv: $("#cmb-Nivel").val(),
            PSec: $("#cmb-Seccion").val()
        }
    }

    ShowLoader(1);
    $.ajax({
        url: url,
        dataType: 'json',
        type: 'post',
        data: parametros,
        success: function (a) {
            console.log(a);
            if (a.Codigo == 0) {
                MostrarAlumnos();
                MensajeOK(a.Mensaje, 'Buen trabajo!!', '');
                ShowLoader(0);
                $("#md-Nuevo").modal('hide');
            }
            else {
                MensajeError(a.Mensaje, 'Ocurrio algo', '');
                ShowLoader(0);
            }
        },
        error: function (x) {
            console.log(x);
            ShowLoader(0);
        },
        complete: function () {
            ShowLoader(0);
        }
    })
}

function Eliminar(id) {
    swal({
        title: "¿Esta seguro de eliminar al alumno?",
        text: "tras ser eliminado ya no podra recuperarse el registro!",
        icon: "warning",
        buttons: true,
        dangerMode: true,
    })
.then((willDelete) => {
    if (willDelete) {
        DeleteAlumno(id);
    }
});
}


function DeleteAlumno(id) {
    ShowLoader(1);
    $.ajax({
        url: '/Alumno/DeleteAlumno',
        dataType: 'json',
        type: 'post',
        data: { Id: id },
        success: function (a) {
            console.log(a);
            if (a.Codigo == 0) {
                MostrarAlumnos();
                MensajeOK(a.Mensaje, 'Buen trabajo!!', '');
                ShowLoader(0);
                $("#md-Nuevo").modal('hide');
            }
            else {
                MensajeError(a.Mensaje, 'Ocurrio algo', '');
                ShowLoader(0);
            }
        },
        error: function (x) {
            console.log(x);
            ShowLoader(0);
        },
        complete: function () {
            ShowLoader(0);
        }
    })
}

function MostrarAlumnos() {
    var body = "";
    ShowLoader(1);
    $.ajax({
        url: '/Alumno/FillAlumnos',
        dataType: 'json',
        type: 'post',
        data: {
            Estado: 1,
            Id: 0
        },
        success: function (a) {
            console.log(a);
            if (a.Codigo == 0) {
                $.each(a.Data, function (i, v) {
                    body += '<tr>';
                    body += '<td>' + v.Nombres + ' ' + v.ApellidoPat + ' ' + v.ApellidoMat + '</td>';
                    body += '<td>' + v.Dni + '</td>';
                    switch (v.Nivel) {
                        case 'I':
                            body += '<td>Inicial</td>';
                            break;
                        case 'P':
                            body += '<td>Primaria</td>';
                            break;
                        case 'S':
                            body += '<td>Secundaria</td>';
                            break;
                    }

                    body += '<td class="text-center">' + v.Seccion + '</td>';
                    body += '<td>' + v.Apoderado + '</td>';
                    body += '<td>' + v.Correo + '</td>';
                    body += '<td class="text-center">';
                    body += '<button class="btn btn-success btn-sm" onclick="GetAlumno(' + v.IdAlumno + ')"><i class="fa fa-pencil"></i></button>';
                    body += '<button class="btn btn-danger btn-sm" onclick="Eliminar(' + v.IdAlumno + ')"><i class="fa fa-trash"></i></button></td>';
                    body += '</tr>';
                })
                $("#body-Alumno").empty();
                $("#body-Alumno").append(body);
                Tabla("tablaAlumno", 10);
                ShowLoader(0);
            }
            else {
                MensajeError(a.Mensaje, 'Ocurrio algo', '');
                ShowLoader(0);
            }
        },
        error: function (x) {
            console.log(x);
            ShowLoader(0);
        },
        complete: function () {
            ShowLoader(0);
        }
    })
}

function GetAlumno(id) {
    ShowLoader(1);
    operacion = false;
    $.ajax({
        url: '/Alumno/FillAlumnos',
        dataType: 'json',
        type: 'post',
        data: {
            Estado: 1,
            Id: id
        },
        success: function (a) {
            console.log(a);
            if (a.Codigo == 0) {
                $("#text-Id").val(id);
                $("#text-Nombres").val(a.Data[0].Nombres);
                $("#text-Apepat").val(a.Data[0].ApellidoPat);
                $("#text-Apemat").val(a.Data[0].ApellidoMat);
                $("#text-Dni").val(a.Data[0].Dni);
                $("#text-Correo").val(a.Data[0].Correo);
                $("#text-Apoderado").val(a.Data[0].Apoderado);
                $("#text-DniApo").val(a.Data[0].DniApoderado);
                $("#text-Telf").val(a.Data[0].TelfonoEmergencia);
                $("#cmb-Nivel").val(a.Data[0].Nivel);
                $("#cmb-Seccion").val(a.Data[0].Seccion);
                ShowLoader(0);
                $("#titleModal").text('Actualizacion de datos');
                $("#md-Nuevo").modal('show');
            }
            else {
                MensajeError(a.Mensaje, 'Ocurrio algo', '');
                ShowLoader(0);
            }
        },
        error: function (x) {
            console.log(x);
            ShowLoader(0);
        },
        complete: function () {
            ShowLoader(0);
        }
    })
}

function Consultar(p) {
    var dni = p == "L" ? $("#text-Dni").val() : $("#text-DniApo").val();
    if (p == "L") {
        if ($.trim($("#text-Dni").val()).length != 8) {
            MensajeError("Longitud incorrecta de documento", "Dni incorrecto", "");
            return false;
        }
    }
    else {
        if ($.trim($("#text-DniApo").val()).length != 8) {
            MensajeError("Longitud incorrecta de documento", "Dni incorrecto", "");
            return false;
        }
    }

    ShowLoader(1);
    $.ajax({
        url: '/Alumno/ConsultarReniec',
        dataType: 'json',
        type: 'post',
        data: { Dni: dni },
        success: function (a) {
            console.log(a);
            if (a.Codigo == 0) {
                if (a.Data.Error == null) {
                    if (p == "L") {
                        $("#text-Nombres").val(a.Data.Result.nombres);
                        $("#text-Apepat").val(a.Data.Result.apellido_paterno);
                        $("#text-Apemat").val(a.Data.Result.apellido_materno);
                    }
                    else {
                        $("#text-Apoderado").val(a.Data.Result.nombres + ' ' + a.Data.Result.apellido_paterno + ' ' + a.Data.Result.apellido_materno);
                    }
                    ShowLoader(0);
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
                    title: "Error interno de Reniec",
                    text: a.Mensaje,
                    icon: "warning",
                    button: "ok!",
                });
                ShowLoader(0);
            }
        },
        error: function (x) {
            console.log(x);
            ShowLoader(0);
        },
        complete: function () {
            ShowLoader(0);
        }
    })
}

function ValidarDatos() {
    if ($("#text-Dni").val() == '') {
        MensajeError("Dni vacio", "Campo obligatorio", "");
        return false;
    }
    if ($("#text-Nombres").val() == '') {
        MensajeError("Nombre del alumno vacio", "Campo obligatorio", "");
        return false;
    }
    if ($("#text-Apepat").val() == '') {
        MensajeError("Apellido paterno vacio", "Campo obligatorio", "");
        return false;
    }
    if ($("#text-Apemat").val() == '') {
        MensajeError("Apellido materno vacio", "Campo obligatorio", "");
        return false;
    }
    if ($("#text-Correo").val() == '') {
        MensajeError("Correo Electronico Vacio", "Campo obligatorio", "");
        return false;
    }
    if ($("#text-DniApo").val() == '') {
        MensajeError("Dni del apoderado Vacio", "Campo obligatorio", "");
        return false;
    }
    if ($("#text-Apoderado").val() == '') {
        MensajeError("Nombre del apoderado vacio", "Campo obligatorio", "");
        return false;
    }

    if ($("#text-Telf").val() == '') {
        MensajeError("Telefono vacio", "Campo obligatorio", "");
        return false;
    }
    if ($("#text-Nivel").val() == '') {
        MensajeError("seleccione nivel", "Campo obligatorio", "");
        return false;
    }
    if ($("#text-Seccion").val() == '') {
        MensajeError("seleccione seccion", "Campo obligatorio", "");
        return false;
    }
    return true;
}

function LimpiarForm() {
    $("#text-Id").val('');
    $("#text-Nombres").val('');
    $("#text-Apepat").val('');
    $("#text-Apemat").val('');
    $("#text-Dni").val('');
    $("#text-Correo").val('');
    $("#text-Apoderado").val('');
    $("#text-DniApo").val('');
    $("#text-Telf").val('');
    $("#cmb-Nivel").val('I');
    $("#cmb-Seccion").val('A');
}