# Server Components và Client Components

CSR, SSR và SSG mô tả lúc tạo ra nội dung HTML. Server và Client Components mô tả ranh giới module và nơi React chạy mã component. Một route SSR có thể kết xuất cả Server Components và HTML ban đầu của Client Components. Quy tắc tương tự áp dụng cho route SSG tại thời điểm build.

```text
app/components/page.tsx        Server Component
└─ PokedexFilter              Client Component với "use client"
   ├─ Ô tìm kiếm và bộ lọc    Event handler chạy trong browser
   └─ PokemonList             Module được import vào client graph
```

`getPokemon()` đọc tệp trên server. Danh sách là dữ liệu có thể serialize, được truyền qua RSC payload để Client Component dùng. Browser chỉ cần JavaScript runtime và các module thuộc client graph như bộ lọc, module danh sách cùng icon được dùng. Mã gọi `node:fs/promises` nằm ở server.

Trong lần tải đầu, browser có thể hiển thị HTML trước rồi React mới hydrate. Hydration gắn hành vi tương tác lên HTML đã có. Thử tắt JavaScript và tải trực tiếp `/components` trong production để thấy danh sách còn hiển thị, trong khi tìm kiếm và lọc chưa cập nhật.

Tham khảo [Server và Client Components của Next.js](https://nextjs.org/docs/app/getting-started/server-and-client-components).
