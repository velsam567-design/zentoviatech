from pathlib import Path

p = Path("apps/web/app/page.tsx")
s = p.read_text(encoding="utf-8")

s = s.replace(
'''            {products.map((product, index) => (
              <article''',
'''            {products.map((product, index) => (
              <Reveal key={product.name} delay={index * 100}>
                <article'''
)

s = s.replace(
'''              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="process"''',
'''              </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section id="process"'''
)

s = s.replace(
'''].map(([number, title, text]) => (
              <div key={number}>''',
'''].map(([number, title, text], index) => (
              <Reveal key={number} delay={index * 100}>
                <div>'''
)

s = s.replace(
'''                <p className="mt-3 leading-7 text-[#556078]">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="technology"''',
'''                <p className="mt-3 leading-7 text-[#556078]">{text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section id="technology"'''
)

p.write_text(s, encoding="utf-8")
