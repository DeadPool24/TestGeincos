var carritoFull = false;
$(document).ready(function () {
    $("#btn-agregarCarrito").click(function () {
        AddCarritoCompra();
    })
    $("#cmb-TipoComprobante").change(function () {
        GetSeries();
        $("#txt-Numero").val('');
    })
    $("#cmb-Serie").change(function () {
        $("#txt-Numero").val($(this).val());
    })
    $("#btn-FinVenta").click(function () {
        AddVenta();
    })
    $("#cmb-Moneda").change(function () {
        if ($(this).val() == 2) {
            $("#dv-TipoCambio").removeClass("hide");
            $("#txt-TipoCambio").focus();
        }
        else
            $("#dv-TipoCambio").addClass("hide");
    })
    $("#btn-Clientes").click(function () {
        $("#md-Clientes").modal('show');
        $("#Body-Clientes").empty();
    })

    $("#btn-AddProducto").click(function () {
        $("#md-Productos").modal('show');
        $("#_bodyProducto").empty();
        $("#total-Productos").text("");
    })
    $("#txt-BuscarProducto").keyup(function () {
        GetProducto();
    })
    $("#txt-NumDocIdentidad")
    $("#txt-PrecioV").keyup(function () {
        var total = 0;
        var precio = parseFloat($(this).val());
        var cantidad = parseFloat($("#txt-CantidadV").val());
        total = CalcularTotal(precio, cantidad);
        $("#txt-TotalV").val(total);
    })

    $("#txt-CantidadV").keyup(function () {
        var total = 0;
        var precio = parseFloat($("#txt-PrecioV").val());
        var cantidad = parseFloat($(this).val());
        total = CalcularTotal(precio, cantidad);
        $("#txt-TotalV").val(total);
    })

    getTipoOperacion();
    GetSeries();
    GetMoneda();
})

function setClienteEventual() {
    if ($("#cmb-TipoComprobante").val() == '03') {
        $("#txt-NumDocIdentidad").val("00000001");
        $("#txt-TipoDocumento").val("Doc. Nacional de Identidad");
        $("#txt-Cliente").val("Cliente eventual");
        $("#txt-IdCliente").val(1);
    }
    else {
        $("#txt-NumDocIdentidad").val('');
        $("#txt-TipoDocumento").val('');
        $("#txt-Cliente").val('');
        $("#txt-IdCliente").val('');
        swal({
            title: "Cliente no valido",
            text: "Cliente eventual no valido para este tipo de comprobante",
            icon: "warning",
            button: "Entendido!",
        });
    }
}

function SCliente(e) {
    if (e.keyCode == 13) {
        GetClientes("", false);
        return false;
    }
}
function BuscarCliente(e) {
    var el = document.getElementById("txt-NumDocIdentidad");
    if (e.keyCode == 13) {
        if (isNaN(el.value)) {
            swal({
                title: "Upps!!",
                text: "Documento de identidad incorrecto",
                icon: "warning",
                button: "ok!",
            });
            return;
        }
        GetClientes($("#txt-NumDocIdentidad").val(), true);
        return false;
    }
}

function AddCarritoCompra(i) {
    var dato = $("#RegP-" + i);
    //if (validarFormProducto() == false)
    //    return;
    $.ajax({
        url: 'AddCarritoCompras',
        datatype: 'json',
        type: 'post',
        async: true,
        data: {
            cod: dato.data('codigoproducto'),
            des: dato.data('name'),
            codOpe: dato.data('afecto'),
            cant: 1,
            pventa: dato.data('pventa'),
            MovKardex: dato.data('kardex'),
            pcompra: dato.data('pcompra'),
            incIgv: dato.data('incigv')
        },
        success: function (a) {
            console.log(a);
            if (a.Codigo == 0) {
                getCarritoCompras();
                alertify.success('Producto agregado');
                //$("#txt-CodigoProductoV").val('');
                //$("#txt-ConceptoV").val('');
                //$("#txt-CantidadV").val('1');
                //$("#txt-PrecioV").val('');
                //$("#md-CantidadComprar").modal('hide');
            } else {
                swal({
                    title: "Producto Repetido",
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

function getCarritoCompras() {
    var _Body = "";
    var totalGravada = 0, TotalInafecto = 0, TotalExonerado = 0, Total = 0, subtotal = 0, totalIgv = 0;
    $("#loading").modal('show');
    $("#Body-Productos").empty();
    $("#ColtotalValor").empty();
    $("#ColtotalIgv").empty();
    $("#ColtotalPrecio").empty();
    $("#ColtotalTotal").empty();
    $.ajax({
        url: 'GetCarritoCompras',
        dataType: 'json',
        type: 'post',
        data: {},
        async: true,
        success: function (a) {
            if (a != null) {
                if (a.Codigo == 0) {
                    if (a.Data.length != 0)
                        carritoFull = true;
                    else
                        carritoFull = false;
                    console.log(carritoFull);
                    $.each(a.Data, function (i, v) {
                        _Body += '<tr>';
                        _Body += '<td><button class="btn btn-danger btn-sm" onclick="RemoveAt(' + i + ')"><i class="fa fa-trash"></i></button></td>';
                        _Body += '<td>' + v.CodigoProducto + '</td>';
                        _Body += '<td>' + v.Producto + '</td>';
                        _Body += '<td><input class="form-control small" type="number" style="width:100px" data-codigo="' + v.CodigoProducto + '" onchange="updateCantidad(' + i + ')"  id="cant-' + i + '" value="' + v.Cantidad.toFixed(2) + '"/></td>';
                        _Body += '<td>' + v.Valor.toFixed(2) + ' </td>';
                        _Body += '<td>' + v.Igv.toFixed(2) + '</td>';
                        _Body += '<td>' + v.Precio.toFixed(2) + '</td>';
                        _Body += '<td>' + v.Total.toFixed(2) + '</td>';
                        _Body += '</tr>';
                        totalGravada += parseFloat(v.TotalGravada);
                        TotalExonerado += parseFloat(v.TotalExonerado);
                        TotalInafecto += parseFloat(v.TotalInafecto);
                        totalIgv += parseFloat(v.Igv);
                        Total += parseFloat(v.Total);
                    })
                    $("#coltotalgravada").text(totalGravada.toFixed(2));
                    $("#coltotalinafecta").text(TotalInafecto.toFixed(2));
                    $("#coltotalexonerada").text(TotalExonerado.toFixed(2));
                    $("#coltotaligv").text(totalIgv.toFixed(2));
                    $("#coltotal").text(Total.toFixed(2));
                    $("#Body-Productos").append(_Body);
                    $("#td-Carrito").fancyTable({
                        sortColumn: 0,
                        pagination: true,
                        perPage: 5,
                        globalSearch: false,
                        searchable: false,
                        sortable: false,
                        paginationClass: "btn btn-success"
                    });
                }
                else {
                    swal({
                        title: "Hay un problema!",
                        text: a.Mensaje,
                        icon: "warning",
                        button: "ok!",
                    });
                }
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

function updateCantidad(i) {
    var codigo = $("#cant-" + i).data("codigo");
    $.ajax({
        url: 'UpdateCantidadCarrito',
        dataType: 'json',
        type: 'post',
        data: { Codigo: codigo, Cantidad: $("#cant-" + i).val() },
        async: true,
        success: function (a) {
            console.log(a);
            if (a.Codigo == 0) {
                getCarritoCompras();
            }
            else {
                swal({
                    title: "Hay un problema!",
                    text: a.Mensaje,
                    icon: "warning",
                    button: "ok!",
                });
            }
        },
        error: function (x) {
            console.error(x);
        },
        complete: function () {

        }
    })
}

function RemoveAt(i) {
    $.ajax({
        url: 'RemoveCarritoCompras',
        dataType: 'json',
        type: 'post',
        data: { i: i },
        async: true,
        success: function (a) {
            console.log(a);
            getCarritoCompras();
        },
        error: function (x) {
            console.error(x);
        },
        complete: function () {

        }
    })
}

function getTipoOperacion() {
    var _Body = "";
    $("#cmb-TipoOperacion").empty();
    $.ajax({
        url: 'GetTipoIgvSunat',
        dataType: 'json',
        type: 'post',
        async: true,
        success: function (a) {
            if (a.Codigo == 0) {
                $.each(a.Data, function (i, v) {
                    _Body += '<option value="' + v.Codigo + '">' + v.Descripcion + '</option>';
                })
                $("#cmb-TipoOperacion").append(_Body);
            } else {
                swal({
                    title: "Hay un problema!",
                    text: a.Mensaje,
                    icon: "warning",
                    button: "ok!",
                });
            }

        },
        error: function (x) {
            console.error(x);
        },
        complete: function () {

        }
    })
}

function getDocumentoIdentidad(flag) {
    var _Body = "";
    if (flag == '')
        $("#cmb-TipoDocumento").empty();
    else
        $("#cmb-DocIdentidad").empty();
    $.ajax({
        url: 'GetDocumentoIdentidad',
        dataType: 'json',
        type: 'post',
        async: true,
        success: function (a) {
            if (a.Codigo == 0) {
                $.each(a.Data, function (i, v) {
                    _Body += '<option value="' + v.CodSunat + '">' + v.Descripcion + '</option>';
                })
                if (flag == '')
                    $("#cmb-TipoDocumento").append(_Body);
                else
                    $("#cmb-DocIdentidad").append(_Body);
            } else {
                swal({
                    title: "Hay un problema!",
                    text: a.Mensaje,
                    icon: "warning",
                    button: "ok!",
                });
            }

        },
        error: function (x) {
            console.error(x);
        },
        complete: function () {

        }
    })
}

function GetSeries() {
    var _Body = "";
    $("#cmb-Serie").empty();
    _Body = '<option value="0">-Seleccione-</option>';
    $.ajax({
        url: 'GetSeriesAsync',
        dataType: 'json',
        type: 'post',
        async: true,
        data: { codDocumento: $("#cmb-TipoComprobante").val() },
        success: function (a) {
            if (a.Codigo == 0) {
                $.each(a.Data, function (i, v) {
                    _Body += '<option value="' + v.Emitidos + '" selected>' + v.SerieActual + '</option>';
                    $("#txt-Numero").val(v.Emitidos);
                })
                $("#cmb-Serie").append(_Body);
            }
            else {
                swal({
                    title: "Hay un problema!",
                    text: a.Mensaje,
                    icon: "warning",
                    button: "ok!",
                });
            }
        },
        error: function (x) {
            console.error(x);
        },
        complete: function () {

        }
    })
}

function GetMoneda() {
    var _Body = "";
    $("#cmb-Moneda").empty();
    _Body = '<option value="0">-Seleccione-</option>';
    $.ajax({
        url: 'GetMoneda',
        dataType: 'json',
        type: 'post',
        async: true,
        data: { codDocumento: $("#cmb-TipoComprobante").val() },
        success: function (a) {
            if (a.Codigo == 0) {
                $.each(a.Data, function (i, v) {
                    if (v.IdMoneda == "1")
                        _Body += '<option value="' + v.IdMoneda + '" selected>' + v.NombreMoneda + ' ' + v.Simbolo + '</option>';
                    else
                        _Body += '<option value="' + v.IdMoneda + '">' + v.NombreMoneda + ' ' + v.Simbolo + '</option>';
                })
                $("#cmb-Moneda").append(_Body);
            }
            else {
                swal({
                    title: "Hay un problema!",
                    text: a.Mensaje,
                    icon: "warning",
                    button: "ok!",
                });
            }
        },
        error: function (x) {
            console.error(x);
        },
        complete: function () {

        }
    })
}

function GetClientes(cliente, flag) {
    var _Body = "";
    if (cliente == "")
        cliente = $("#txt-BuscarCliente").val();
    $.ajax({
        url: '/Cliente/GetClienteOffLine',
        dataType: 'json',
        type: 'post',
        async: true,
        data: { cliente: cliente },
        success: function (a) {
            console.log(a);
            if (a.Codigo == 0) {
                if (flag == true) {
                    $("#txt-Cliente").val("");
                    $("#txt-IdCliente").val("");
                    $("#txt-TipoDocumento").val("");
                    if (a.Data.length > 0) {
                        $("#txt-Cliente").val(a.Data[0].Nombres + ' ' + a.Data[0].ApellidoP + ' ' + a.Data[0].ApellidoM);
                        $("#txt-IdCliente").val(a.Data[0].IdCliente);
                        $("#txt-TipoDocumento").val(a.Data[0].NombreDocumento);
                    }
                    else {
                        if (isNaN(cliente))
                            return;
                        swal({
                            title: "El cliente no existe",
                            text: "¿Desea registrar un cliente?",
                            icon: "warning",
                            buttons: true,
                            dangerMode: true,
                        }).then((willDelete) => {
                            if (willDelete) {
                                Fcliente = true;
                                $("#btnNuevo").click();
                                $("#cmb-Documento").val(6);
                                $("#txt-numeroDoc").val(cliente);
                                HideOrShow(6);
                                $("#btn-ConsultarCliente").click();
                            }
                        });
                    }
                }
                else {
                    $.each(a.Data, function (i, v) {
                        var Nombre = "";
                        if (v.idTipoDocIdent == 1)
                            Nombre = v.Nombres + ' ' + v.ApellidoP + ' ' + v.ApellidoM;
                        else
                            Nombre = v.Nombres;
                        _Body += '<tr style="font-size:x-small;cursor:pointer;" ondblclick="SetCliente(' + v.IdCliente + ')">';
                        _Body += '<td data-name="' + Nombre + '" data-NombreTipoDoc="' + v.NombreDocumento + '" data-idTipoDoc="' + v.idTipoDocIdent + '" data-NumDoc="' + $.trim(v.NumDocIdentidad) + '" id="Reg-' + v.IdCliente + '">' + Nombre + '</td>';
                        _Body += '<td>' + v.NomenclaturaDocumento + '</td>';
                        _Body += '<td>' + $.trim(v.NumDocIdentidad) + '</td>';
                        _Body += '<td>' + v.Direccion + '</td>';
                        if (v.Telefono != "" && v.TelMovil != "")
                            _Body += '<td>' + v.TelMovil + ' - ' + v.Telefono + ' </td>';
                        else
                            _Body += '<td>' + v.TelMovil + '</td>';
                        _Body += '</tr>';
                    })
                    $("#Body-Clientes").empty();
                    $("#Body-Clientes").append(_Body);
                    $("#td-Cliente").fancyTable({
                        sortColumn: 0,
                        pagination: true,
                        perPage: 10,
                        globalSearch: false,
                        searchable: false,
                        sortable: false,
                        paginationClass: "btn btn-danger"
                    });
                }
            }
            else {
                swal({
                    title: "Hay un problema!",
                    text: a.Mensaje,
                    icon: "warning",
                    button: "ok!",
                });
                $("#Body-Clientes").empty();
            }
        },
        error: function (x) {
            console.error(x);
            $("#Body-Clientes").empty();
        },
        complete: function () {

        }
    })
}

function SetCliente(i) {
    var dato = $("#Reg-" + i);
    $("#txt-Cliente").val(dato.data('name'));
    $("#txt-IdCliente").val(i);
    $("#txt-TipoDocumento").val(dato.data('nombretipodoc'));
    $("#txt-NumDocIdentidad").val(dato.data('numdoc'));
    $("#md-Clientes").modal('hide');
}

function GetProducto() {
    var _Body = "";
    $.ajax({
        url: '/Producto/GetProducto',
        dataType: 'json',
        type: 'post',
        async: true,
        data: { descripcion: $("#txt-BuscarProducto").val() },
        success: function (a) {
            console.log(a);
            if (a.Codigo == 0) {
                $.each(a.Data, function (i, v) {

                    _Body += '<tr ondblclick="AddCarritoCompra(' + i + ',1)" style="font-size:x-small;cursor:pointer;" data-incigv="' + v.PrecioIncIgv + '" data-pcompra="' + v.UltimoPCompra + '" data-kardex="' + v.EnKardex + '" data-name="' + v.Descripcion + '" data-afecto="' + v.AfectoIgv + '" data-pventa="' + v.PVenta + '" data-codigoproducto="' + $.trim(v.CodigoProducto) + '" id="RegP-' + i + '">';
                    _Body += '<td>' + $.trim(v.CodigoProducto) + '</td>';
                    _Body += '<td>' + v.Descripcion + '</td>';
                    if (parseInt(v.stock) <= 0)
                        _Body += '<td style="color:red">' + parseFloat(v.stock).toFixed(2) + '</td>';
                    else
                        _Body += '<td>' + parseFloat(v.stock).toFixed(2) + '</td>';
                    _Body += '<td>' + v.TipoUnidadMedida + '</td>';
                    _Body += '<td>' + v.PVenta.toFixed(2) + '</td>';
                    _Body += '<td class="text-center"><button class="btn btn-success btn-sm" title="agregar" style="font-size:x-small;" onclick="AddCarritoCompra(' + i + ',1)"><i class="fa fa-check"></i></button></td>';
                    _Body += '</tr>';
                })
                $("#total-Productos").text(a.Data.length + " registros");
                $("#_bodyProducto").empty();
                $("#_bodyProducto").append(_Body);
                $("#td-Producto").fancyTable({
                    sortColumn: 0,
                    pagination: true,
                    perPage: 10,
                    globalSearch: false,
                    searchable: false,
                    sortable: false,
                    paginationClass: "btn btn-danger"
                });
            }
            else {
                swal({
                    title: "Hay un problema!",
                    text: a.Mensaje,
                    icon: "warning",
                    button: "ok!",
                });
                $("#_bodyProducto").empty();
            }
        },
        error: function (x) {
            console.error(x);
            $("#_bodyProducto").empty();
        },
        complete: function () {

        }
    })
}

function AddProducto(i) {
    var dato = $("#RegP-" + i);
    $("#txt-ConceptoV").val(dato.data('name'));
    $("#txt-CodigoProductoV").val(dato.data('codigoproducto'));
    $("#txt-PrecioV").val(dato.data('pventa'));
    $("#txt-AfectoV").val(dato.data('afecto'));
    $("#txt-IncIgv").val(dato.data('incigv'));
    $("#txt-Kardex").val(dato.data('kardex'));
    $("#txt-PCompra").val(dato.data('pcompra'));
    $("#txt-CantidadV").val(1);
    $("#txt-TotalV").val(dato.data('pventa'));
    $("#md-Productos").modal('hide');
    $("#md-CantidadComprar").modal('show');
}

function AddVenta() {
    if (validarFormVenta() == false)
        return;
    $("#loading").modal('show');
    $.ajax({
        url: 'AddVentas',
        dataType: 'json',
        type: 'post',
        data: {
            TipoComprobante: $("#cmb-TipoComprobante").val(),
            Serie: $("#cmb-Serie option:selected").text(),
            Numero: $("#txt-Numero").val(),
            FechaVencimiento: $("#cmb-FechaVencimiento").val(),
            igv: $("#coltotaligv").text(),
            total: $("#coltotal").text(),
            ValorVta: $("#coltotalgravada").text(),
            ValorIgv: $("#coltotaligv").text(),
            IdCliente: $("#txt-IdCliente").val(),
            NombreCliente: $("#txt-Cliente").val(),
            RucCliente: $("#txt-NumDocIdentidad").val(),
            IdMoneda: $("#cmb-Moneda").val(),
            fechaVenta: $("#cmb-FechaVenta").val(),
            TipoCambio: $("#txt-TipoCambio").val()
        },
        success: function (a) {
            console.log(a);
            if (a.Codigo != 0) {
                swal({
                    title: "Hay un problema!",
                    text: a.Mensaje,
                    icon: "warning",
                    button: "ok!",
                });
                $("#loading").modal('hide');
            }
            else {
                $("#loading").modal('hide');
                swal({
                    title: "¿Desea imprimir el comprobante?",
                    text: a.Mensaje,
                    icon: "success",
                    buttons: true,
                    dangerMode: true,
                }).then((willDelete) => {
                    if (willDelete) {
                        let pdfWindow = window.open("")
                        pdfWindow.document.write("<iframe width='100%' height='100%' src='data:application/pdf;base64, " + encodeURI(a.Comprobante) + "'></iframe>")
                        var file = new Blob([a.Comprobante], { type: 'application/pdf' });
                        location.reload();
                    }
                });
            }
        },
        error: function (x) {
            console.log(x);
            swal({
                title: "Hay un problema!",
                text: x.statusText,
                icon: "warning",
                button: "ok!",
            });
        }
    })
}

function validarFormProducto() {
    if ($("#txt-CodigoProducto").val() == 0) {
        Mensaje("Ingrese el Codigo del Producto");
        return false;
    }
    if ($("#txt-Concepto").val() == 0) {
        Mensaje("Ingrese el concepto y/o Descripcion del producto o servicio");
        return false;
    }

    if ($("#txt-Cantidad").val() == 0) {
        Mensaje("Ingrese la cantidad a vender");
        return false;
    }
    if ($("#txt-Precio").val() == "") {
        Mensaje("Ingrese el precio de venta");
        return false;
    }
    return true;
}


function validarFormVenta() {

    if ($("#cmb-Serie").val() == 0) {
        Mensaje("Seleccione la Serie");
        return false;
    }
    if ($("#cmb-Moneda").val() == 0) {
        Mensaje("Seleccione la moneda");
        return false;
    }
    if ($("#cmb-Moneda").val() == 2) {
        if ($("#txt-TipoCambio").val() == 0) {
            Mensaje("Ingrese el Tipo de Cambio");
            return false;
        }
    }
    if ($("#cmb-TipoComprobante").val() == '01') {
        if ($("#txt-IdCliente").val() == 1) {
            Mensaje("Cliente eventual no valido para este tipo de comprobante");
            return false;
        }
        if ($("#txt-NumDocIdentidad").val().length != 11) {
            Mensaje("Documento del cliente no valido para facturas");
            return false;
        }
    }
    else {
        if ($("#txt-NumDocIdentidad").val().length != 8) {
            Mensaje("Documento del cliente no valido para boletas");
            return false;
        }
    }
    if ($("#txt-IdCliente").val() == "") {
        Mensaje("Seleccione el cliente");
        return false;
    }
    if (carritoFull == false) {
        Mensaje("Debe tener al menos un producto para vender");
        return false;
    }
    return true;
}

function Mensaje(mensaje) {
    swal({
        title: "Faltan Datos!",
        text: mensaje,
        icon: "warning",
        button: "Entendido!",
    });
}

function CalcularTotal(cant, pre) {
    return total = cant * pre;
}