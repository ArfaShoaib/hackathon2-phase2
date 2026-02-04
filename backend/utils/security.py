from passlib.context import CryptContext
from typing import Optional
import re


# Configure with pbkdf2 as it's more reliable and doesn't have the 72-char limit of bcrypt
pwd_context = CryptContext(
    schemes=["pbkdf2_sha256"],
    deprecated="auto",
    pbkdf2_sha256__default_rounds=12000
)


def hash_password(password: str) -> str:
    """
    Hash a password using pbkdf2.
    """
    return pwd_context.hash(password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """
    Verify a plain password against a hashed password.
    """
    return pwd_context.verify(plain_password, hashed_password)


def validate_email(email: str) -> bool:
    """
    Validate email format using regex.
    """
    email_regex = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return re.match(email_regex, email) is not None


def validate_password_strength(password: str) -> bool:
    """
    Validate password strength.
    Require at least 8 characters.
    """
    return len(password) >= 8