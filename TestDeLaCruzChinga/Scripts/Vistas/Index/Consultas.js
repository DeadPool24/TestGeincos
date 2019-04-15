var FlagFoot = [];
$(document).ready(function ($) {
    $("#Em").addClass("active");
    if ($(Window).width() > 784) {
        $("#div-Table").show();
        $("#div-Divs").hide();
        GetComprobantesTabla("");
        $("#btn-search").click(function () {
            GetComprobantesTabla("Si");
        })
        $("#btn-refresh").click(function () {
            GetComprobantesTabla("");
        })
    }
    else {
        $("#div-Table").hide();
        $("#div-Divs").show();
        GetComprobantesDivs("");
        $("#btn-search").click(function () {
            GetComprobantesDivs("Si");
        })
        $("#btn-refresh").click(function () {
            GetComprobantesDivs("");
        })
    }
});

function GetC(e) {
    if (e.keyCode == 13) {
        GetComprobantesTabla("Si");
        return false;
    }
}

function GetComprobantesTabla(fill) {
    var cantidad = 0;
    var _Body = "";
    var _Option = "<option value=''>--TODOS--</option>";

    var url = "GetComprobantes";
    var params = null;

    if (fill != "") {
        url = "FillComprobantes";
        params = { client: $("#txt-Cliente").val(), DateIn: $("#txt-FechaInicial").val(), DateOut: $("#txt-FechaFinal").val(), Invoice: $("#cmbTipoComprobante").val() };
    }
    $("#body-Documentos").empty();
    $("#CountRows").empty();
    $.ajax({
        beforeSend: function () {
            $("#loading").modal('show');
        },
        url: url,
        dataType: 'json',
        type: 'post',
        data: params,
        success: function (data) {
            console.log(data);
            if (data != null) {
                if (data.Codigo == "0") {
                    $.each(data.Data, function (i, v) {
                        _Body += '<tr style="font-size:x-small" data-serie="' + v.serieComprobante + '" data-nro="' + v.numeroComprobante + '" id="venta-' + i + '" data-codigo="' + v.CodigoVenta + '">';
                        _Body += "<td>" + v.TipoComprobanteNombre + "</td>";
                        _Body += "<td>" + v.serieComprobante + "-" + $.trim(v.numeroComprobante) + "</td>";
                        _Body += "<td>" + v.NombreCliente + "</td>";
                        _Body += "<td>" + v.DocCliente + "</td>";
                        _Body += "<td>" + v.TotalComprobante + " " + v.Moneda + "</td>";
                        _Body += "<td class='text-center'>" + moment(v.FechaEmision).format("DD-MM-YYYY") + "</td>";
                        _Body += "<td class='text-center' style='font-size:small'>";
                        _Body += "<button class='label label-success btn-sm' onclick='GetXml(" + i + ")'>Xml</button>";
                        //_Body += "<a class='label label-info' style='cursor:pointer; color:white;'  target='blank' href='DownloadFile?file=" + $.trim(v.NombreZip) + ".ZIP'>Cdr</a>";
                        _Body += "<a class='label label-danger' style='cursor:pointer; color:white;'  target='blank' href='#' ><i class='fa fa-eye'></i></a>";
                        _Body += "<button title='Imprimir Comprobante' class='label label-warning btn-sm' onclick='PrintVenta(" + i + ")'><i class='fa fa-print'></i></button>";
                        _Body += "</td>";
                        _Body += '</tr>';
                        cantidad++;
                    })
                    $("#CountRows").append(cantidad + " Comprobantes");
                    $("#body-Documentos").append(_Body);
                    if (fill == "") {
                        $.each(data.Comprobantes, function (i, v) {
                            _Option += '<option value=' + v.IdTipo + '>' + v.Documento + '</option>';
                        })
                        $("#cmbTipoComprobante").append(_Option);
                    }

                    $("#td-Comprobantes").fancyTable({
                        sortColumn: 0,
                        pagination: true,
                        perPage: 10,
                        globalSearch: false,
                        searchable: false,
                        sortable: false,
                        paginationClass: "btn btn-success"
                    });
                }
                else {
                    swal({
                        title: "Hay un problema!",
                        text: data.Mensaje,
                        icon: "warning",
                        button: "ok!",
                    });
                }
            }
        },
        error: function (x) {
            $("#loading").modal('hide');
        },
        complete: function () {
            $("#loading").modal('hide');
        }
    })
}

function GetXml(id) {
    var codigo = $("#venta-" + id).data("codigo");
    var serie = $("#venta-" + id).data("serie");
    var nro = $("#venta-" + id).data("nro");
    $("#loading").modal('show');
    $.ajax({
        url: 'GetXML',
        dataType: 'text',
        type: 'post',
        data: {
            codigo: codigo
        },
        success: function (a) {
            console.log(a);
            if (a != "") {
                var xmltext = a;
                var pom = document.createElement('a');
                var filename = serie + "-" + nro + ".xml";
                var pom = document.createElement('a');
                var bb = new Blob([xmltext], { type: 'text/plain' });
                pom.setAttribute('href', window.URL.createObjectURL(bb));
                pom.setAttribute('download', filename);
                pom.dataset.downloadurl = ['text/plain', pom.download, pom.href].join(':');
                pom.draggable = true;
                pom.classList.add('dragout');
                pom.click();
            }
            $("#loading").modal('hide');
        },
        error: function (x) {
            console.log(x);
            swal({
                title: "Hay un problema!",
                text: x.statusText,
                icon: "warning",
                button: "ok!",
            });
            $("#loading").modal('hide');
        }
    })
}

function PrintVenta(id) {
    var codigo = $("#venta-" + id).data("codigo");
    $("#loading").modal('show');
    $.ajax({
        url: 'PrintComprobante',
        dataType: 'text',
        type: 'post',
        data: {
            codigo: codigo
        },
        success: function (a) {
            if (a != "") {
                let pdfWindow = window.open("")
                pdfWindow.document.write("<iframe width='100%' height='100%' src='data:application/pdf;base64, " + encodeURI(a) + "'></iframe>")
                var file = new Blob([a], { type: 'application/pdf' });
            }
            $("#loading").modal('hide');
        },
        error: function (x) {
            console.log(x);
            swal({
                title: "Hay un problema!",
                text: x.statusText,
                icon: "warning",
                button: "ok!",
            });
            $("#loading").modal('hide');
        }
    })
}


function getDetalle(i) {
    var codigo = $("#venta-" + i);
    $("#txt-CodigoVenta").val(codigo.data("codigo"));
    GetDatosVenta();
    $("#md-Detalle").modal('show');
}

function GetDatosVenta() {
    $.ajax({
        url: 'GetDatosVenta',
        dataType: 'json',
        type: 'post',
        data: { Codigo: $("#txt-CodigoVenta").val() },
        success: function (a) {
            console.log(a);
            if (a.Codigo == 0) {

            }
            else {
                swal({
                    title: "Ups! Tenemos un problema",
                    text: data.Mensaje,
                    icon: "warning",
                    button: "ok!",
                });
            }
        },
        error: function (x) {
            console.error(x);
        },
        complete: function (c) {
            console.log(c);
        }
    })
}

function GetComprobantesDivs(fill) {
    var cantidad = 0;
    var _Body = "";
    var _Option = "<option value=''>--TODOS--</option>";
    var url = "GetComprobantes";
    var params = null;

    if (fill != "") {
        url = "FillComprobantes";
        params = { client: $("#txt-Cliente").val(), DateIn: $("#txt-FechaInicial").val(), DateOut: $("#txt-FechaFinal").val(), Invoice: $("#cmbTipoComprobante").val() };
    }
    $("#Body-Divs").empty();
    $("#CountRows").empty();
    $.ajax({
        beforeSend: function () {
            $("#loading").modal('show');
        },
        url: url,
        dataType: 'json',
        type: 'post',
        data: params,
        success: function (data) {
            console.log(data);
            if (data != null) {
                if (data.Codigo == "0") {
                    $.each(data.Data, function (i, v) {
                        var Footer = { id: i, Flag: true };
                        FlagFoot.push(Footer);
                        _Body += '<div class="row" style="background-color:#b7ebe9; padding-top:10px;">';
                        _Body += '<div class="col-xs-12 col-md-8">';
                        _Body += '<div class="panel panel-default">';
                        _Body += '<div class="panel-body">';
                        _Body += v.TipoComprobanteNombre + ' ' + v.serieComprobante + "-" + v.numeroComprobante + '<i class="fa fa-plus text-right" id="plus-' + i + '" onclick="viewFooter(' + i + ')"></i>';
                        _Body += '</div>';
                        _Body += '<div class="panel-footer hide Foot-' + i + '" id="Foot-' + i + '">';
                        _Body += "<b>Cliente: </b>" + v.NombreCliente + "<br />";
                        _Body += "<b>Doc Cliente: </b>" + v.DocCliente + "<br />";
                        _Body += "<b>Total: </b>" + v.TotalComprobante + " " + v.Moneda + "<br />";
                        _Body += "<b>Emision: </b>" + moment(v.FechaEmision).format("DD-MM-YYYY") + "<br />";
                        _Body += "<b>Estado: </b>" + v.estadoEnvio + "<br />";
                        _Body += "<a class='label label-success' style='cursor:pointer; color:white;'  target='blank' href='DownloadFile?file=" + v.NombreZip + ".XML'>Xml</a>";
                        _Body += "<a class='label label-info' style='cursor:pointer; color:white;'  target='blank' href='DownloadFile?file=" + v.NombreZip + ".ZIP'>Cdr</a>";
                        _Body += '</div>';
                        _Body += '</div>';
                        _Body += '</div>';
                        _Body += '</div>';
                        cantidad++;
                    })
                    $("#CountRows").append(cantidad + " Comprobantes");
                    $("#Body-Divs").append(_Body);

                    if (fill == "") {
                        $.each(data.Comprobantes, function (i, v) {
                            _Option += '<option value=' + v.IdTipo + '>' + v.Documento + '</option>';
                        })
                        $("#cmbTipoComprobante").append(_Option);
                    }
                }
                else {
                    swal({
                        title: "Hay un problema!",
                        text: data.Mensaje,
                        icon: "warning",
                        button: "ok!",
                    });
                }
            }
        },
        error: function (x) {
        },
        complete: function () {
            $("#loading").modal('hide');
        }
    })
}

function viewFooter(i) {
    if (FlagFoot[i][1] == true) {
        FlagFoot[i][1] = false;
        $(".Foot-" + i).hide("fast");
        $("#Foot-" + i).removeClass('hide');
        $("#plus-" + i).removeClass('fa fa-minus');
        $("#plus-" + i).addClass('fa fa-plus');
    }
    else {
        FlagFoot[i][1] = true;
        $("#Foot-" + i).show("fast");
        $("#Foot-" + i).removeClass('hide');
        $("#plus-" + i).removeClass('fa fa-plus');
        $("#plus-" + i).addClass('fa fa-minus');
    }
}