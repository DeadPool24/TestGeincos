var operacion = true;//VARIABLE GLOBAL QUE IDENTIFICA SI SE REGISTRA O ACTUALIZA UN REGISTRO DE CURSO (TRUE: NUEVO, FALSE: ACTUALIZADO)
$(document).ready(function () {

    MostrarCursos();
})

function MostrarCursos() {
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
                    body += '<tr data-alumno="' + v.Nombres + ' ' + v.ApellidoPat + ' ' + v.ApellidoMat + '" data-idalumno="' + v.IdAlumno + '" id="col-' + i + '">';
                    body += '<th>' + v.Nombres + ' ' + v.ApellidoPat + ' ' + v.ApellidoMat + '</th>';
                    body += '<th class="text-center"><i class="btn btn-info fa fa-file-o" onclick="getNotas(' + i + ')"> Cursos </i></th>';
                    body += '</tr>';
                })
                $("#body-Curso").empty();
                $("#body-Curso").append(body);
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


function AddCursoAlumno() {
    var body = "";
    ShowLoader(1);
    $.ajax({
        url: '/Curso/AddCursoAlumno',
        dataType: 'json',
        type: 'post',
        data: {
            IdCurso: $("#id-Curso").val(),
            IdAlumno: $("#id-Alumno").val()
        },
        success: function (a) {
            console.log(a);
            if (a.Codigo == 0) {
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

function GetNotasPorCurso() {
    var body = "";
    ShowLoader(1);
    $.ajax({
        url: '/Curso/FillNotasPorAlumno',
        dataType: 'json',
        type: 'post',
        data: {
            IdAlumno: $("#id-Alumno").val()
        },
        success: function (a) {
            console.log(a);
            if (a.Codigo == 0) {
                $.each(a.Data, function (i, v) {
                    body += '<tr>';
                    body += '<td>' + v.Descripcion + '</td>';
                    body += '<td><input class="form-control" onblur="UpdateNota(' + v.IdCurso + ',' + v.IdAlumno + ',' + i + ')" type="number" value="' + v.Nota + '" data-idcurso="' + v.IdCurso + '" data-idalumno="' + v.IdAlumno + '" id="Nota-' + i + '" /></td>';
                    body += '<td class="text-center"><i onclick="DeleteCursoAlumno(' + v.IdCurso + ',' + v.IdAlumno + ')" class="btn btn-danger fa fa-close"></i></td>';
                    body += '</tr>';
                })
                $("#body-notas").empty();
                $("#body-notas").append(body);
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

function UpdateNota(curso, alumno, i) {
    var body = "";
    var nota = $("#Nota-" + i).val()
    ShowLoader(1);
    $.ajax({
        url: '/Curso/UpdateNotaAlumno',
        dataType: 'json',
        type: 'post',
        data: {
            idCurso: curso,
            idalumno: alumno,
            nota: nota
        },
        success: function (a) {
            console.log(a);
            if (a.Codigo == 0) {
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

function DeleteCursoAlumno(curso, alumno) {
    var body = "";
    ShowLoader(1);
    $.ajax({
        url: '/Curso/DeleteCursoAlumno',
        dataType: 'json',
        type: 'post',
        data: {
            idCurso: curso,
            idalumno: alumno
        },
        success: function (a) {
            console.log(a);
            if (a.Codigo == 0) {
                GetNotasPorCurso();
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

function GetCursos() {
    var body = "";
    ShowLoader(1);
    $.ajax({
        url: '/Curso/getCurso',
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
                    body += '<tr data-curso="' + v.Descripcion + '" data-idcurso="' + v.IdCurso + '" id="col-' + i + '">';
                    body += '<th>' + v.Descripcion + '</th>';
                    body += '<th class="text-center"><i class="btn btn-info fa fa-check" onclick="back(' + v.IdCurso + ')"></i></th>';
                    body += '</tr>';
                })
                $("#body-Cursos").empty();
                $("#body-Cursos").append(body);
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


function back(idcurso) {
    $("#id-Curso").val(idcurso);
    AddCursoAlumno();
    $("#md-Cursos").modal('hide');
    getNotas($("#id-Pos").val());
}

function getCursos() {
    $("#md-Alumnos").modal('hide');
    GetCursos();
    $("#md-Cursos").modal('show');
}

function getNotas(d) {
    var alumno = $("#col-" + d).data("alumno");
    var idalumno = $("#col-" + d).data("idalumno");
    $("#id-Pos").val(d);
    $("#id-Alumno").val(idalumno);
    GetNotasPorCurso();
    $("#titleModal").text("Cursos de " + alumno);
    $("#md-Alumnos").modal('show');
}