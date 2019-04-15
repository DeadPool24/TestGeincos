var operacion = true;//VARIABLE GLOBAL QUE IDENTIFICA SI SE REGISTRA O ACTUALIZA UN REGISTRO DE ALUMNO (TRUE: NUEVO, FALSE: ACTUALIZADO)
$(document).ready(function () {
    $("#btnNuevo").click(function () {
        $("#md-Nuevo").modal('show');
        $("#titleModal").text('Registro de alumno nuevo');
        operacion = true;
    })
    MostrarAlumnos();
})

function AgregarAlumno() {
    var url = operacion == true ? '/Alumno/AddAlumno' : '/Alumno/UpdateAlumno';
    var parametros = {};

    if (operacion == true) {
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
        parametros = {
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
                    body += '<button class="btn btn-danger btn-sm"><i class="fa fa-trash"></i></button></td>';
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