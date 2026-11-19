import { CsrPokedex } from '../../components/csr-pokedex'
import { RenderingPage } from '../../components/rendering-page'

export default function Page() {
  return <RenderingPage strategy="CSR"><CsrPokedex /></RenderingPage>
}
