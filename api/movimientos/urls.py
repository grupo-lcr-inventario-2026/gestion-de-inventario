
from django.urls import path

from .views import MovimientosView, ConfirmarMovimientoView


urlpatterns = [
    path(
        'movimientos',
        MovimientosView.as_view(),
        name='movimientos'
    ),
    path(
        'movimientos/confirmar',
        ConfirmarMovimientoView.as_view(),
        name='confirmar-movimiento'
    ),
]
