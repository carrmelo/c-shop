export const emailRegex = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
// tslint:disable-next-line: max-line-length
export const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?/.&])[A-Za-z\d@$!%/.*?&]{8,}$/;

export const passwordMessage = `Password must contain a minimum of eight characters, at least
one uppercase letter, one lowercase letter, one number and one special character @$!%*?/.&`;
