import { AppWindow, Package, Server } from 'lucide-react'
import { PageHeading } from '../../components/page-heading'
import { PokedexFilter } from '../../components/pokedex-filter'
import { getPokemon } from '../../lib/pokemon-server'

export default async function Page() {
  const pokemon = await getPokemon()
  return <>
    <PageHeading category="Kiến trúc component" title="Server & Client Components">
      Danh sách Pokémon có thể xuất hiện trước. Sau hydration, ô tìm kiếm và bộ lọc mới phản hồi thao tác.
    </PageHeading>
    <ol className="strategy-grid lab-flow" aria-label="Luồng từ server đến browser">
      <li className="panel">
        <span className="strategy-icon tone-fire"><Server size={20} aria-hidden /></span>
        <h2>Server đọc dữ liệu</h2>
        <p><code>Page</code> đọc {pokemon.length} Pokémon từ tệp JSON trên server.</p>
      </li>
      <li className="panel">
        <span className="strategy-icon tone-electric"><Package size={20} aria-hidden /></span>
        <h2>Browser nhận nội dung</h2>
        <p>HTML hiển thị Pokédex. RSC payload mang dữ liệu Pokémon đến bộ lọc.</p>
      </li>
      <li className="panel">
        <span className="strategy-icon tone-water"><AppWindow size={20} aria-hidden /></span>
        <h2>JavaScript gắn tương tác</h2>
        <p><code>PokedexFilter</code> nhận thao tác nhập và lọc ngay trong browser.</p>
      </li>
    </ol>
    <section className="section" aria-labelledby="filter-heading">
      <div className="section-heading"><div><h2 id="filter-heading">Thử trước và sau hydration</h2><p>Chọn mỗi trạng thái bên dưới, rồi thử tìm Pikachu.</p></div></div>
      <PokedexFilter pokemon={pokemon} hydrationDemo />
    </section>
    <details className="section panel">
      <summary>Cây component và JavaScript được gửi đi</summary>
      <pre className="tree">Page · Server Component{'\n'}└─ PokedexFilter · Client Component{'\n'}   └─ PokemonList · thuộc client graph</pre>
      <p>Browser tải mã bộ lọc, danh sách trong client graph và các phụ thuộc. Mã đọc tệp JSON chạy trên server.</p>
    </details>
  </>
}
