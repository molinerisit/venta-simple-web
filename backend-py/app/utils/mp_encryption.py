"""
Symmetric encryption for Mercado Pago OAuth tokens stored in DB.
Key is derived from SECRET_KEY so no extra env var is needed.
"""

import base64
import hashlib

from cryptography.fernet import Fernet

from ..config import get_settings


def _fernet() -> Fernet:
    raw = hashlib.sha256(get_settings().secret_key.encode()).digest()
    return Fernet(base64.urlsafe_b64encode(raw))


def encrypt_token(plaintext: str) -> str:
    if not plaintext:
        return ""
    return _fernet().encrypt(plaintext.encode()).decode()


def decrypt_token(ciphertext: str) -> str:
    if not ciphertext:
        return ""
    return _fernet().decrypt(ciphertext.encode()).decode()
