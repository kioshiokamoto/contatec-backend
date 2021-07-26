import sendEmail from '../sendMail';
let email = sendEmail;
email = jest.fn(() => 'Autorizado');

const functionEmail = {
  sendEmail,
};

describe('Utilidad de envio de correos', () => {
  it('Debe ser equivalente a codigo generado', () => {
    expect(sendEmail).toMatchSnapshot();
  });
  it('Debe poder ser llamado', () => {
    const result = email('test@mail.com', 'http://google.com', 'test');
    expect(result).toBe('Autorizado');
    expect(email).toHaveBeenCalled();
    expect(email).toHaveBeenCalledWith(
      'test@mail.com',
      'http://google.com',
      'test',
    );
  });
  it('Debe poder ser llamado', () => {
    const spy = jest.spyOn(functionEmail, 'sendEmail');

    const sendingEmail = functionEmail.sendEmail(
      'test@mail.com',
      'http://google.com',
      'test',
    );

    expect(spy).toHaveBeenCalled();
    //No retorna nada
    expect(sendingEmail).toBe(undefined);
    spy.mockReset();
    spy.mockRestore();
  });
});
