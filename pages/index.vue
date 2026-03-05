<template>
  <div class="dashboard">
    <div class="dashboard-header">
      <h1>SaaS Dashboard</h1>
      <p>Nuxt 3 · AG Grid · Netlify serverless</p>
    </div>

    <div class="stats-grid">
      <div class="stat-card" v-for="stat in stats" :key="stat.label">
        <div class="label">{{ stat.label }}</div>
        <div class="value">{{ stat.value }}</div>
        <div :class="['change', stat.trend]">{{ stat.change }}</div>
      </div>
    </div>

    <div class="grid-section">
      <h2>Users</h2>
      <AgGridVue
        style="height: 320px;"
        class="ag-theme-alpine-dark"
        :rowData="rowData"
        :columnDefs="columnDefs"
        :defaultColDef="defaultColDef"
        :pagination="true"
        :paginationPageSize="10"
        animateRows
      />
    </div>

    <div class="api-section">
      <h2>Serverless API test</h2>
      <div class="api-actions">
        <button class="btn btn-primary" @click="callApi">Call /api/auth (valid token)</button>
        <button class="btn btn-danger"  @click="callApiFail">Call /api/auth (no token)</button>
      </div>
      <div v-if="apiResult" :class="['api-response', apiResult.ok ? 'success' : 'error']">
        {{ apiResult.body }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { AgGridVue } from 'ag-grid-vue3'
import 'ag-grid-community/styles/ag-grid.css'
import 'ag-grid-community/styles/ag-theme-alpine.css'

const stats = [
  { label: 'Total Users',   value: '1 248',  change: '+12% this month', trend: 'up'   },
  { label: 'Revenue',       value: '$8 420',  change: '+5.4% vs last month', trend: 'up'   },
  { label: 'Active Plans',  value: '342',     change: '-2 this week', trend: 'down'  },
  { label: 'API Calls',     value: '94 k',    change: '+31% this month', trend: 'up'   },
]

const columnDefs = ref([
  { field: 'id',       headerName: 'ID',     width: 80  },
  { field: 'name',     headerName: 'Name',   flex: 1    },
  { field: 'email',    headerName: 'Email',  flex: 2    },
  { field: 'plan',     headerName: 'Plan',   width: 120 },
  { field: 'status',   headerName: 'Status', width: 120 },
])

const defaultColDef = ref({ sortable: true, filter: true, resizable: true })

const rowData = ref([
  { id: 1,  name: 'Alice Martin',    email: 'alice@example.com',  plan: 'Pro',     status: 'Active'   },
  { id: 2,  name: 'Bob Chen',        email: 'bob@example.com',    plan: 'Starter', status: 'Active'   },
  { id: 3,  name: 'Clara Dupont',    email: 'clara@example.com',  plan: 'Pro',     status: 'Inactive' },
  { id: 4,  name: 'David Lee',       email: 'david@example.com',  plan: 'Enterprise', status: 'Active' },
  { id: 5,  name: 'Emma Wilson',     email: 'emma@example.com',   plan: 'Starter', status: 'Active'   },
  { id: 6,  name: 'Frank Müller',    email: 'frank@example.com',  plan: 'Pro',     status: 'Active'   },
  { id: 7,  name: 'Grace Kim',       email: 'grace@example.com',  plan: 'Pro',     status: 'Inactive' },
  { id: 8,  name: 'Henry Brown',     email: 'henry@example.com',  plan: 'Starter', status: 'Active'   },
  { id: 9,  name: 'Iris Nakamura',   email: 'iris@example.com',   plan: 'Enterprise', status: 'Active' },
  { id: 10, name: 'Jack Tremblay',   email: 'jack@example.com',   plan: 'Pro',     status: 'Active'   },
  { id: 11, name: 'Kara Santos',     email: 'kara@example.com',   plan: 'Starter', status: 'Inactive' },
  { id: 12, name: 'Leo Fontaine',    email: 'leo@example.com',    plan: 'Pro',     status: 'Active'   },
])

const apiResult = ref(null)

async function callApi() {
  try {
    const res = await fetch('/api/auth', {
      headers: { Authorization: 'Bearer demo-secret' }
    })
    const body = await res.text()
    apiResult.value = { ok: res.ok, body: `${res.status} — ${body}` }
  } catch (e) {
    apiResult.value = { ok: false, body: String(e) }
  }
}

async function callApiFail() {
  try {
    const res = await fetch('/api/auth')
    const body = await res.text()
    apiResult.value = { ok: res.ok, body: `${res.status} — ${body}` }
  } catch (e) {
    apiResult.value = { ok: false, body: String(e) }
  }
}
</script>
