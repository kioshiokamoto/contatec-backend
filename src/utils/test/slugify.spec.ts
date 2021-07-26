import { slugify } from '../slugify';
describe('Utilidad de funcion para generar slugs', () => {
  it('Funcion debe poder ser llamada', () => {
    const slug = slugify('test diego');
    expect(slugify).toMatchSnapshot();
  });
  it('Funcion debe retornar slug correcatamente', () => {
    const slug = slugify('test diego');
    expect(slug).toBe('test_diego');
  });
});
