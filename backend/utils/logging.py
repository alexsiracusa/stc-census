import logging
from functools import wraps


def safe_debug_task(error_message=None):
    """
    Decorator for error handling in async functions,
    and allows log messages to be toggled on/off.
    This assumes the decorated function...

    - Is an async function.

    - Takes a debug parameter (bool) as a keyword argument.

    - Logs exceptions using the logger module.

    :param error_message: Custom error message.
    """
    def decorator(func):
        @wraps(func)
        async def wrapper(*args, debug=False, **kwargs):
            if not debug:
                logging.disable(logging.INFO)
            try:
                result = await func(*args, debug=debug, **kwargs)
                return result
            except Exception as e:
                msg = error_message or f"Error in {func.__name__}"
                logger.error(f"{msg}: {str(e)}")
            finally:
                if not debug:
                    logging.disable(logging.NOTSET)
        return wrapper
    return decorator