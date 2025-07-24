<script setup lang="ts">
import {
  Users,
  Heart,
  Ticket,
  LayoutTemplate,
  ArrowUpRight,
} from 'lucide-vue-next'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { SidebarTrigger } from '@/components/ui/sidebar'

definePageMeta({
  layout: 'dashboard',
  auth: true,
})

// 1. Ambil data statistik melalui proxy
const { data: statsData, pending: statsPending } = useFetch<{ data: DashboardStats }>('/api/proxy/dashboard/stats')

// 2. Ambil 5 pernikahan terbaru melalui proxy
const { data: recentWeddings, pending: weddingsPending } = useFetch<{ data: RecentWedding[] }>('/api/proxy/weddings', {
  query: { limit: 5 } // Backend Anda harus mendukung query 'limit' ini
})

const stats = computed(() => statsData.value?.data)
</script>

<template>
  <header class="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
        <div class="flex items-center gap-2 px-4">
          <SidebarTrigger class="-ml-1" />
          <Separator orientation="vertical" class="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem class="hidden md:block">
                <BreadcrumbLink href="/dashboard">
                  Dashboard
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator class="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>Home</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>

  <main class="flex flex-1 flex-col gap-4 p-4 pt-0">
    <!-- Bagian Kartu Ringkasan -->
    <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle class="text-sm font-medium">Total Pernikahan</CardTitle>
          <Ticket class="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div v-if="statsPending" class="h-8 w-1/2 bg-muted animate-pulse rounded-md" />
          <div v-else class="text-2xl font-bold">{{ stats?.totalWeddings || 0 }}</div>
          <p class="text-xs text-muted-foreground">Jumlah undangan yang Anda kelola.</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle class="text-sm font-medium">Template Dimiliki</CardTitle>
          <LayoutTemplate class="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div v-if="statsPending" class="h-8 w-1/2 bg-muted animate-pulse rounded-md" />
          <div v-else class="text-2xl font-bold">{{ stats?.totalTemplates || 0 }}</div>
          <p class="text-xs text-muted-foreground">Jumlah template yang telah Anda beli.</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle class="text-sm font-medium">Total Ucapan</CardTitle>
          <Heart class="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div v-if="statsPending" class="h-8 w-1/2 bg-muted animate-pulse rounded-md" />
          <div v-else class="text-2xl font-bold">+{{ stats?.totalWishes || 0 }}</div>
          <p class="text-xs text-muted-foreground">Ucapan yang diterima di semua undangan.</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle class="text-sm font-medium">Total Tamu Hadir</CardTitle>
          <Users class="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div v-if="statsPending" class="h-8 w-1/2 bg-muted animate-pulse rounded-md" />
          <div v-else class="text-2xl font-bold">{{ stats?.totalGuests || 0 }}</div>
          <p class="text-xs text-muted-foreground">Berdasarkan konfirmasi RSVP.</p>
        </CardContent>
      </Card>
    </div>

    <!-- Bagian Tabel Pernikahan Terbaru -->
    <Card>
      <CardHeader>
        <CardTitle>Pernikahan Terbaru</CardTitle>
        <CardDescription>Daftar 5 pernikahan yang terakhir Anda kelola.</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Pengantin</TableHead>
              <TableHead class="hidden sm:table-cell">Template</TableHead>
              <TableHead class="hidden md:table-cell">Tanggal Akad</TableHead>
              <TableHead class="hidden md:table-cell">Tanggal Resepsi</TableHead>
              <TableHead class="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <template v-if="weddingsPending">
              <TableRow v-for="i in 3" :key="i">
                <TableCell><div class="h-5 w-3/4 bg-muted animate-pulse rounded-md" /></TableCell>
                <TableCell class="hidden sm:table-cell"><div class="h-5 w-1/2 bg-muted animate-pulse rounded-md" /></TableCell>
                <TableCell class="hidden md:table-cell"><div class="h-5 w-2/3 bg-muted animate-pulse rounded-md" /></TableCell>
                <TableCell class="text-right"><div class="h-8 w-16 bg-muted animate-pulse rounded-md ml-auto" /></TableCell>
              </TableRow>
            </template>
            <template v-else-if="recentWeddings && recentWeddings.length > 0">
              <TableRow v-for="wedding in recentWeddings" :key="wedding.id">
                <TableCell>
                  <div class="font-medium">{{ wedding.pengantin_pria }} & {{ wedding.pengantin_wanita }}</div>
                </TableCell>
                <TableCell class="hidden sm:table-cell">
                  <Badge variant="outline">{{ wedding.template.nama_template }}</Badge>
                </TableCell>
                <TableCell class="hidden md:table-cell">{{ new Date(wedding.tanggal_akad).toLocaleDateString('id-ID', { dateStyle: 'long' }) }}</TableCell>
                <TableCell class="hidden md:table-cell">{{ new Date(wedding.tanggal_resepsi).toLocaleDateString('id-ID', { dateStyle: 'long' }) }}</TableCell>
                <TableCell class="text-right">
                  <Button as-child size="sm" variant="outline">
                    <NuxtLink :to="`/dashboard/weddings`">
                      Kelola
                      <ArrowUpRight class="h-4 w-4 ml-2" />
                    </NuxtLink>
                  </Button>
                </TableCell>
              </TableRow>
            </template>
            <template v-else>
                <TableRow>
                    <TableCell colspan="4" class="text-center h-24">Anda belum memiliki data pernikahan.</TableCell>
                </TableRow>
            </template>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  </main>
</template>
