function AddCategoria() {
    var url = "";
    var params = {};
    if (flag == true) {
        url = '/Categoria/AddCategoria';
        params = {
            NombreCategoria: document.getElementById("txt-Categoria").value,
            Estado: $("#cmb-EstadoCategoria").val()
        };
    }
    else {
        url = '/Categoria/updateCategoria';
        params = {
            IdCategoria: $("#H-IdCategoria").val(),
            NombreCategoria: document.getElementById("txt-Categoria").value,
            Estado: $("#cmb-EstadoCategoria").val()
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
                swal({
                    title: "Buen trabajo!!",
                    text: a.Mensaje,
                    icon: "success",
                    button: "Genial!",
                });
                GetCategoria();
                $("#Md-Categoria").modal('hide');
            }
            else {
                swal({
                    title: "Uppss!! Ocurrió Álgo",
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


function GetCategoria() {
    var _Body = "<option value='0'>--Seleccione Categoria--</option>";
    $.ajax({
        url: '/Categoria/GetAllCategoria',
        dataType: 'json',
        type: 'post',
        success: function (a) {
            console.log(a);
            if (a.Codigo == 0) {
                $.each(a.Data, function (i, v) {
                    _Body += '<option value="' + v.IdCategoria + '">' + v.NombreCategoria + '</option>';
                })
                $("#cmb-Categoria").empty();
                $("#cmb-Categoria").append(_Body);
            }
            else {
                $("#cmb-Categoria").empty();
                swal({
                    title: "Uppss!! Ocurrió Álgo",
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


function GetIdCategoria(id) {
    $.ajax({
        url: '/Categoria/GetCategoria',
        dataType: 'json',
        type: 'post',
        data: { IdCategoria: id },
        success: function (a) {
            console.log(a);
            if (a.Codigo == 0) {
                $("#txt-Categoria").val(a.Data[0].NombreCategoria);
                $("#cmb-Familia").val(a.Data[0].IdFamilia);
                $("#cmb-Estado").val(a.Data[0].Estado);
                $("#H-IdCategoria").val(id);
                $("#Md-Categoria").modal('show');
            }
            else {
                swal({
                    title: "Uppss!! Ocurrió Álgo",
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
