$(document).ready(function () {
    MostrarNotas();
})

function MostrarNotas() {
    var body = "";
    ShowLoader(1);
    $.ajax({
        url: '/Curso/GetNotasGeneral',
        dataType: 'json',
        type: 'post',
        success: function (a) {
            console.log(a);
            if (a.Codigo == 0) {
                $.each(a.Data, function (i, v) {
                    body += '<tr>';
                    body += '<th colspan="2">' + v.Nombres + '</th>';
                    body += '</tr>';
                    $.each(v.Notas, function (y, z) {
                        body += '<tr>';
                        body += '<td>' + z.Descripcion + '</td>';
                        body += '<td>' + z.Nota + '</td>';
                        body += '</tr>';
                    })
                })
                $("#headNotas").empty();
                $("#headNotas").append(body);
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
