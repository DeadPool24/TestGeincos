$(document).ready(function () {
    GetCajaBanco();
})

function GetCajaBanco() {
    ShowLoader(1);
    var body = '<option value="0">--Seleccione Caja--</option>';
    $("#cmb-CajaBanco").empty();
    $.ajax({
        url: '/Caja/GetCajaBanco',
        dataType: 'json',
        type: 'post',
        success: function (a) {
            if (a.Codigo == 0) {
                $.each(a.Data, function (i, v) {
                    if (IdCaja != "") {
                        if (IdCaja == v.IdCajabanco)
                            body += '<option selected value="' + v.IdCajaBanco + '">' + v.NombreCaja + '</option>';
                        else
                            body += '<option selected value="' + v.IdCajaBanco + '">' + v.NombreCaja + '</option>';
                    }
                    else
                        body += '<option selected value="' + v.IdCajaBanco + '">' + v.NombreCaja + '</option>';
                })
                $("#cmb-CajaBanco").append(body);
                ShowLoader(0);
            }
            else {
                MensajeError(a.Mensaje, "", "");
                ShowLoader(0);
            }
        },
        error: function (x) {
            console.log(x);
            ShowLoader(0);
        },
        complet: function () {
            ShowLoader(0);
        }
    })
}

function AperturarCaja() {
    if ($("#cmb-CajaBanco").val() == "" || $("#cmb-CajaBanco").val() == 0) {
        MensajeError("Seleccione la caja a aperturar", "Sin apertura de caja", "");
        return;
    }
    ShowLoader(1);
    var body = "";
    $.ajax({
        url: '/Caja/AperturarCaja',
        dataType: 'json',
        type: 'post',
        data: { observacion: $("#text-observacion").val(), fecha: $("#text-fecha").val(), montoApertura: $("#text-monto").val(), idcaja: $("#cmb-CajaBanco").val() },
        success: function (a) {
            if (a.Codigo == 0) {
                setReadOnly();
                MensajeOK(a.Mensaje, "", "");
                ShowLoader(0);
            }
            else {
                MensajeError(a.Mensaje, "", "");
                ShowLoader(0);
            }
        },
        error: function (x) {
            console.log(x);
            ShowLoader(0);
        },
        complet: function () {
            ShowLoader(0);
        }
    })
}

function setReadOnly() {
    $("#text-estado").val("APERTURADA");
    $("#text-observacion").attr("readonly", true);
    $("#text-fecha").attr("readonly", true);
    $("#text-monto").attr("readonly", true);
    $("#cmb-CajaBanco").attr("readonly",true);
}