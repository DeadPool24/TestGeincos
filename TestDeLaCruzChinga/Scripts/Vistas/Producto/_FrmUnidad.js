$(document).ready(function () {
    $("#btn-NuevaUnidad").click(function () {
        $("#FrmMantUnidad")[0].reset();
        FlagUnidad = true;
        $("#Md-MantUnidad").modal('show');
    })
})
function AddTipoUnidadMedida() {
    var url = "";
    var params = {};
    if (FlagUnidad == true) {
        url = '/TipoUnidadMedida/AddTipoUnidadMedida';
        params = {
            NombreTipoUm: $("#txt-UnidadMedida").val(),
            Estado: $("#cmb-EstadoUnidad").val(),
            Abreviatura: $("#txt-Abreviatura").val()
        };
    }
    else {
        url = '/TipoUnidadMedida/updateTipoUnidadMedida';
        params = {
            IdTipoUnidadMedida: $("#H-IdTipoUnidadMedida").val(),
            NombreTipoUm: $("#txt-UnidadMedida").val(),
            Estado: $("#cmb-EstadoUnidad").val(),
            Abreviatura: $("#txt-Abreviatura").val()
        };
    }
    $.ajax({
        url: url,
        dataType: 'json',
        type: 'post',
        data: params,
        success: function (a) {
            console.log(a);
            if (a.Codigo == 0) {
                GetTipoUnidadMedida();
                $("#Md-MantUnidad").modal('hide');
                swal({
                    title: "Estupendo!! Todo Salio Bien.",
                    text: a.Mensaje,
                    icon: "success",
                    button: "Continuemos!",
                });
            }
            else {
                swal({
                    title: "Uppss!! Ocurrió Álgo.",
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

function GetIdTipoUnidadMedida(id) {
    var _Body = "";
    $.ajax({
        url: '/TipoUnidadMedida/GetIdTipoUnidadMedida',
        dataType: 'json',
        type: 'post',
        data: { IdTipoUnidadMedida: id },
        success: function (a) {
            console.log(a);
            if (a.Codigo == 0) {
                $("#txt-UnidadMedida").val(a.Data[0].NombreTipoUM);
                $("#H-IdTipoUnidadMedida").val(id);
                $("#txt-Abreviatura").val(a.Data[0].Abreviatura);
                $("#cmb-Estado").val(a.Data[0].Estado);
            }
            else {
                swal({
                    title: "Uppss!! Ocurrió Álgo.",
                    text: a.Mensaje,
                    icon: "warning",
                    button: "ok!",
                });
            }
        },
        error: function (x) {

        },
        complete: function () {

        }
    })
}

function GetTipoUnidadMedida() {
    var _Body = "";
    $.ajax({
        url: '/TipoUnidadMedida/GetTipoUnidadMedida',
        dataType: 'json',
        type: 'post',
        success: function (a) {
            console.log(a);
            if (a.Codigo == 0) {
                $.each(a.Data, function (i, v) {
                    _Body += '<tr id="Col_' + v.IdTipoUnidadMedida + '" data-unidad="' + v.NombreTipoUM + '" style="cursor:pointer" ondblclick="SetUnidad(' + v.IdTipoUnidadMedida + ')">';
                    _Body += '<td>' + v.NombreTipoUM + '</td>';
                    _Body += '<td class="text-center"><button class="btn btn-info" onclick="EditarUnidad(' + v.IdTipoUnidadMedida + ')">Editar</button></td>';
                    _Body += '</tr>';
                    //_Body += '<div id="Col_' + v.IdTipoUnidadMedida + '" data-unidad="' + v.NombreTipoUM + '" class="col-md-4 col-sm-6 col-xs-6" style="cursor:pointer" ondblclick="SetUnidad(' + v.IdTipoUnidadMedida + ')">';
                    //_Body += '<div class="panel-body cssUnidad">';
                    //_Body += '<button class="close" onclick="EditarUnidad(' + v.IdTipoUnidadMedida + ')"><i class="fa fa-pencil"></i></button>';
                    //_Body += '<div class="col-md-2 col-sm-2 col-xs-2">';
                    //_Body += v.NombreTipoUM;
                    //_Body += '</div>';
                    //_Body += '</div>';
                    //_Body += '</div>';
                })
                $("#bodyUnidad").empty();
                $("#bodyUnidad").append(_Body);
            }
            else {
                swal({
                    title: "Uppss!! Ocurrió Álgo.",
                    text: a.Mensaje,
                    icon: "warning",
                    button: "ok!",
                });
            }
        },
        error: function (x) {

        },
        complete: function () {

        }
    })
}

function EditarUnidad(id) {
    $("#FrmMantUnidad")[0].reset();
    FlagUnidad = false;
    GetIdTipoUnidadMedida(id);
    $("#Md-MantUnidad").modal('show');
}

function SetUnidad(v) {
    $("#H-IdTipoUnidadMedida").val(v);
    $("#txt-Presentacion").val($("#Col_" + v).data("unidad"));
    console.log(v);
    console.log($("#Col_" + v).data("nombre"));
    $("#Md-Unidad").modal('hide');
}