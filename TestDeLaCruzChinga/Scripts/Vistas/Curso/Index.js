var operacion = true;//VARIABLE GLOBAL QUE IDENTIFICA SI SE REGISTRA O ACTUALIZA UN REGISTRO DE CURSO (TRUE: NUEVO, FALSE: ACTUALIZADO)
$(document).ready(function () {
    $("#btnNuevo").click(function () {
        $("#md-Nuevo").modal('show');
        $("#titleModal").text('Registro de curso nuevo');
        operacion = true;
        LimpiarForm();
    })
    MostrarCursos();
})

function AgregarCurso() {
    if (ValidarDatos() != true)
        return;
    var url = operacion == true ? '/Curso/AddCurso' : '/Curso/UpdateCurso';//SE IDENTIFICA EL TIPO DE OPERACION SEGUN EL BOTON PRESIONADO
    var parametros = {};

    if (operacion == true) {//REGISTRO DE NUEVO CURSO
        parametros = {
            Descripcion: $("#text-Curso").val()
        }
    }
    else {
        parametros = {//ACTUALIZACION DE CURSO - SE AGREGA EL PARAMETRO ID
            id: $("#text-Id").val(),
            Descripcion: $("#text-Curso").val()
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
                MostrarCursos();
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
        title: "¿Esta seguro de eliminar el curso?",
        text: "tras ser eliminado ya no podra recuperarse el registro!",
        icon: "warning",
        buttons: true,
        dangerMode: true,
    })
.then((willDelete) => {
    if (willDelete) {
        DeleteCurso(id);
    }
});
}


function DeleteCurso(id) {
    ShowLoader(1);
    $.ajax({
        url: '/Curso/DeleteCurso',
        dataType: 'json',
        type: 'post',
        data: { Id: id },
        success: function (a) {
            console.log(a);
            if (a.Codigo == 0) {
                MostrarCursos();
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

function MostrarCursos() {
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
                    body += '<tr>';
                    body += '<td>' + v.Descripcion + '</td>';
                    body += '<td class="text-center">';
                    body += '<button class="btn btn-success btn-sm" onclick="GetCurso(' + v.IdCurso + ')"><i class="fa fa-pencil"></i></button>';
                    body += '<button class="btn btn-danger btn-sm" onclick="Eliminar(' + v.IdCurso + ')"><i class="fa fa-trash"></i></button></td>';
                    body += '</tr>';
                })
                $("#body-Curso").empty();
                $("#body-Curso").append(body);
                Tabla("tablaCurso", 10);
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

function GetCurso(id) {
    ShowLoader(1);
    operacion = false;
    $.ajax({
        url: '/Curso/getCurso',
        dataType: 'json',
        type: 'post',
        data: {
            Estado: 1,
            Id: id
        },
        success: function (a) {
            console.log(a);
            if (a.Codigo == 0) {
                ShowLoader(0);
                $("#text-Id").val(id);
                $("#text-Curso").val(a.Data[0].Descripcion);
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

function ValidarDatos() {
    if ($("#text-Curso").val() == '') {
        MensajeError("Descripcion vacia", "Campo obligatorio", "");
        return false;
    }

    return true;
}

function LimpiarForm() {
    $("#text-Id").val('');
    $("#text-Curso").val('');
}