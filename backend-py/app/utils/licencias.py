"""
Helpers para generación y gestión de claves de licencia.
Formato: VSTX-XXXX-XXXX-XXXX  (prefijo fijo + 3 grupos de 4 chars alfanuméricos)
"""
import secrets
import string

_CHARS = string.ascii_uppercase + string.digits


def generar_clave() -> str:
    def grupo():
        return "".join(secrets.choice(_CHARS) for _ in range(4))
    return f"VSTX-{grupo()}-{grupo()}-{grupo()}"
