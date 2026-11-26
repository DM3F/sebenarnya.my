'use client';

import { useMemo, useState } from 'react';
import { FileText, Pencil, Plus, Trash2 } from 'lucide-react';
import {
  Alert, Avatar, Badge, Breadcrumb, Button, Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader,
  CardTitle, Checkbox, EmptyState, IconButton, Pagination, RadioGroup, SearchField, Select, Separator, Skeleton,
  Switch, Table, TableBody, TableCell, TableHead, TableHeader, TableRow, Toaster, Tooltip, Verdict, toast,
} from '@/components/ui';

/* Dashboard components on the /design-system page: one demo per component, then the same
   CMS panel in default and compact density so the difference is visible side by side.
   Rows are example data, not real fact-checks. */

const ROWS = [
  { id: 1, title: 'Pautan bantuan tunai melalui WhatsApp', verdict: 'palsu', agency: 'KPDN', views: 18240, date: '2026-11-24', status: 'Diterbitkan' },
  { id: 2, title: 'Amaran hujan lebat di Pantai Timur', verdict: 'makluman', agency: 'MetMalaysia', views: 9310, date: '2026-11-23', status: 'Diterbitkan' },
  { id: 3, title: 'Sekolah di Selangor beroperasi seperti biasa', verdict: 'benar', agency: 'KPM', views: 4120, date: '2026-11-22', status: 'Draf' },
  { id: 4, title: 'Harga RON95 naik minggu depan', verdict: 'palsu', agency: 'KKMM', views: 27650, date: '2026-11-21', status: 'Diterbitkan' },
  { id: 5, title: 'Lesen memandu tamat tempoh boleh diperbaharui dalam talian', verdict: 'benar', agency: 'JPJ', views: 6480, date: '2026-11-20', status: 'Semakan' },
];
const fmtDate = (iso) => new Date(iso).toLocaleDateString('ms-MY', { day: 'numeric', month: 'short' });
const fmtNum = (n) => n.toLocaleString('ms-MY');

function Group({ title, note, children }) {
  return (
    <div className="dsg-group">
      <div className="dsg-group__head">
        <h3 className="dsg-group__title">{title}</h3>
        {note && <p className="dsg-group__note">{note}</p>}
      </div>
      {children}
    </div>
  );
}

function Demo({ code, children, wide }) {
  return (
    <figure className={`dsg-demo${wide ? ' dsg-demo--wide' : ''}`}>
      <div className="dsg-demo__stage dsg-demo__stage--column">{children}</div>
      {code && <figcaption><code className="dsg-code">{code}</code></figcaption>}
    </figure>
  );
}

/* The CMS panel: toolbar, selectable and sortable table, row actions, pagination */
function ChecksPanel() {
  const [sort, setSort] = useState({ key: 'date', dir: 'descending' });
  const [selected, setSelected] = useState(() => new Set([2]));
  const [page, setPage] = useState(1);

  const rows = useMemo(() => {
    const out = [...ROWS].sort((a, b) => (a[sort.key] > b[sort.key] ? 1 : -1));
    return sort.dir === 'descending' ? out.reverse() : out;
  }, [sort]);
  const sortBy = (key) => () => setSort((s) => ({ key, dir: s.key === key && s.dir === 'descending' ? 'ascending' : 'descending' }));
  const sortOf = (key) => (sort.key === key ? sort.dir : 'none');
  const all = selected.size === ROWS.length;
  const some = selected.size > 0 && !all;
  const toggle = (id, on) => setSelected((s) => { const n = new Set(s); if (on) n.add(id); else n.delete(id); return n; });

  return (
    <Card variant="outline" className="dsg-panel">
      <CardHeader>
        <CardTitle>Semakan fakta</CardTitle>
        <CardDescription>{selected.size ? `${selected.size} dipilih` : `${ROWS.length} semakan minggu ini`}</CardDescription>
        <CardAction><Button icon={Plus} size="sm" onClick={() => toast('Draf baharu dibuka')}>Semakan baharu</Button></CardAction>
      </CardHeader>
      <div className="dsg-toolbar">
        <SearchField size="sm" hideLabel label="Tapis semakan" placeholder="Tapis tajuk atau agensi…" buttonLabel={null} onSubmit={() => {}} />
        <Select size="sm" aria-label="Verdict" defaultValue="semua">
          <option value="semua">Semua verdict</option>
          <option value="palsu">Palsu</option>
          <option value="makluman">Makluman</option>
          <option value="benar">Benar</option>
        </Select>
      </div>
      <Table label="Senarai semakan fakta">
        <TableHeader>
          <TableRow>
            <TableHead check>
              <Checkbox label="Pilih semua" hideLabel checked={all} indeterminate={some}
                onCheckedChange={(on) => setSelected(on ? new Set(ROWS.map((r) => r.id)) : new Set())} />
            </TableHead>
            <TableHead>Tajuk</TableHead>
            <TableHead>Verdict</TableHead>
            <TableHead align="num" sort={sortOf('views')} onSort={sortBy('views')}>Tontonan</TableHead>
            <TableHead sort={sortOf('date')} onSort={sortBy('date')}>Tarikh</TableHead>
            <TableHead>Status</TableHead>
            <TableHead><span className="ui-sr-only">Tindakan</span></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((r) => (
            <TableRow key={r.id} selected={selected.has(r.id)}>
              <TableCell check>
                <Checkbox label={`Pilih: ${r.title}`} hideLabel checked={selected.has(r.id)} onCheckedChange={(on) => toggle(r.id, on)} />
              </TableCell>
              <TableCell className="dsg-cell-title">{r.title}</TableCell>
              <TableCell><Verdict type={r.verdict} variant="plain" agency={r.agency} /></TableCell>
              <TableCell align="num">{fmtNum(r.views)}</TableCell>
              <TableCell>{fmtDate(r.date)}</TableCell>
              <TableCell><Badge variant={r.status === 'Diterbitkan' ? 'muted' : 'outline'} size="sm">{r.status}</Badge></TableCell>
              <TableCell>
                <span className="dsg-row-actions">
                  <Tooltip content="Sunting"><IconButton icon={Pencil} label={`Sunting: ${r.title}`} variant="quiet" size="icon-sm" /></Tooltip>
                  <Tooltip content="Padam"><IconButton icon={Trash2} label={`Padam: ${r.title}`} variant="quiet" size="icon-sm" /></Tooltip>
                </span>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <CardFooter className="dsg-panel__footer">
        <Pagination page={page} pageCount={12} onPageChange={setPage} />
      </CardFooter>
    </Card>
  );
}

export default function DesignSystemDashboard() {
  const [radio, setRadio] = useState('sendiri');
  const [loading, setLoading] = useState(true);

  return (
    <section className="dsg-section" id="dashboard" aria-labelledby="dashboard-title">
      <header className="dsg-section__head">
        <h2 className="dsg-section__title" id="dashboard-title">Komponen dashboard</h2>
        <p className="dsg-section__lead">
          Untuk CMS, extension dan alat dalaman. API ikut shadcn/ui, dibina atas elemen asli dan token kita.
          Data dalam contoh di bawah ialah contoh sahaja.
        </p>
      </header>

      <Group title="Kepadatan: lalai vs compact"
        note='Panel yang sama. Kanan: data-density="compact" pada bekasnya. Hanya nilai token berubah (kawalan 36px, baris 40px, jarak lebih rapat); komponen tidak berubah. Compact untuk desktop sahaja.'>
        <div className="dsg-density">
          <figure className="dsg-density__col">
            <figcaption><code className="dsg-code">lalai</code></figcaption>
            <ChecksPanel />
          </figure>
          <figure className="dsg-density__col" data-density="compact">
            <figcaption><code className="dsg-code">data-density=&quot;compact&quot;</code></figcaption>
            <ChecksPanel />
          </figure>
        </div>
      </Group>

      <Group title="Card" note="muted (lalai) untuk kumpulan dalam halaman · outline untuk panel kerja · raised untuk permukaan atas taupe. Saiz kad menentukan padding dan radius.">
        <div className="dsg-demos">
          {[['muted', 'Lalai, taupe'], ['outline', 'Panel kerja'], ['raised', 'Atas permukaan taupe']].map(([v, d]) => (
            <Card key={v} variant={v}>
              <CardHeader>
                <CardTitle>Tontonan minggu ini</CardTitle>
                <CardDescription>{d} · <code className="dsg-code">variant=&quot;{v}&quot;</code></CardDescription>
              </CardHeader>
              <CardContent><p className="dsg-stat">66,800</p></CardContent>
            </Card>
          ))}
        </div>
      </Group>

      <Group title="Pilihan: Checkbox · RadioGroup · Switch"
        note="Checkbox untuk pilihan yang dihantar dengan borang · Switch untuk tetapan yang berkuat kuasa serta-merta · RadioGroup untuk satu daripada beberapa pilihan yang semuanya kelihatan.">
        <div className="dsg-demos">
          <Demo code="<Checkbox label hint indeterminate>">
            <Checkbox label="Hantar e-mel kepada pengadu" hint="Selepas semakan diterbitkan." defaultChecked />
            <Checkbox label="Tandakan sebagai keutamaan" />
            <Checkbox label="Sebahagian dipilih" indeterminate />
            <Checkbox label="Tidak tersedia" disabled />
          </Demo>
          <Demo code='<RadioGroup items value onValueChange>'>
            <RadioGroup label="Siapa yang menyemak?" value={radio} onValueChange={setRadio}
              items={[
                { value: 'sendiri', label: 'Saya sendiri' },
                { value: 'agensi', label: 'Hantar kepada agensi', hint: 'Agensi menerima pautan semakan.' },
                { value: 'pasukan', label: 'Pasukan AIFA', disabled: true },
              ]} />
          </Demo>
          <Demo code="<Switch label hint>">
            <Switch label="Terbitkan secara automatik" hint="Apabila agensi mengesahkan." defaultChecked />
            <Switch label="Notifikasi WhatsApp" />
            <Switch label="Mod penyelenggaraan" disabled />
          </Demo>
        </div>
      </Group>

      <Group title="Mesej: Alert · Toast" note="Alert kekal dalam halaman (ralat borang, notis atas jadual). Toast untuk pengesahan ringkas yang hilang sendiri selepas 5 saat.">
        <div className="dsg-demos">
          <Demo code='<Alert title>' wide>
            <Alert title="Semakan ini menunggu pengesahan agensi.">KPDN dijangka memberi maklum balas dalam 24 jam.</Alert>
            <Alert variant="success" title="Semakan diterbitkan.">Ia kini kelihatan di laman web dan WhatsApp AIFA.</Alert>
            <Alert variant="destructive" title="Semakan tidak dapat disimpan."
              action={<Button variant="link" size="sm">Cuba lagi</Button>}>
              Medan &quot;Sumber rasmi&quot; kosong. Tambah pautan kenyataan agensi.
            </Alert>
          </Demo>
          <Demo code="toast(…) + <Toaster />">
            <Button variant="outline" onClick={() => toast('Draf disimpan')}>Toast ringkas</Button>
            <Button variant="outline" onClick={() => toast({ title: 'Semakan diterbitkan', description: 'Pautan bantuan tunai melalui WhatsApp', variant: 'success', action: { label: 'Lihat', onClick: () => {} } })}>Toast dengan tindakan</Button>
          </Demo>
        </div>
      </Group>

      <Group title="Navigasi: Breadcrumb · Pagination · Tooltip">
        <div className="dsg-demos">
          <Demo code="<Breadcrumb items>" wide>
            <Breadcrumb items={[{ label: 'Papan pemuka', href: '#dashboard' }, { label: 'Semakan fakta', href: '#dashboard' }, { label: 'Pautan bantuan tunai' }]} />
          </Demo>
          <Demo code="<Pagination page pageCount>" wide>
            <Pagination page={6} pageCount={20} onPageChange={() => {}} />
          </Demo>
          <Demo code='<Tooltip content><IconButton variant="quiet" /></Tooltip>'>
            <span className="dsg-row-actions">
              <Tooltip content="Sunting"><IconButton icon={Pencil} label="Sunting" variant="quiet" /></Tooltip>
              <Tooltip content="Lihat sumber"><IconButton icon={FileText} label="Lihat sumber" variant="quiet" /></Tooltip>
              <Tooltip content="Padam"><IconButton icon={Trash2} label="Padam" variant="quiet" /></Tooltip>
            </span>
          </Demo>
        </div>
      </Group>

      <Group title="Kandungan: Avatar · Skeleton · EmptyState · Separator">
        <div className="dsg-demos">
          <Demo code='<Avatar alt fallback size="sm | md">'>
            <span className="dsg-row-actions">
              <Avatar alt="Kementerian Perdagangan Dalam Negeri" fallback="KP" />
              <Avatar alt="Jabatan Pengangkutan Jalan" fallback="JPJ" />
              <Avatar alt="Nur Aisyah" size="sm" />
            </span>
          </Demo>
          <Demo code='<Skeleton variant="text | circle | block">'>
            <div className="dsg-skeleton-card" aria-busy={loading}>
              {loading ? (
                <>
                  <span className="dsg-row-actions"><Skeleton variant="circle" width="var(--size-avatar)" /><Skeleton variant="text" width="60%" /></span>
                  <Skeleton variant="text" width="100%" />
                  <Skeleton variant="text" width="80%" />
                </>
              ) : (
                <p className="dsg-group__note">Kandungan dimuatkan.</p>
              )}
            </div>
            <Button variant="quiet" size="sm" onClick={() => setLoading((v) => !v)}>{loading ? 'Tamat muat' : 'Muat semula'}</Button>
          </Demo>
          <Demo code="<EmptyState icon title description action>" wide>
            <EmptyState title="Belum ada semakan dalam draf"
              description="Semakan yang anda mula tetapi belum terbitkan akan muncul di sini."
              action={<Button icon={Plus}>Semakan baharu</Button>} />
          </Demo>
          <Demo code="<Separator />" wide>
            <p className="dsg-group__note">Kumpulan pertama</p>
            <Separator />
            <p className="dsg-group__note">Kumpulan kedua</p>
          </Demo>
        </div>
      </Group>

      <Toaster />
    </section>
  );
}
