<script type="ts">
  export let marks = [];

  const currentMarkType = marks && marks?[0]?.type;
</script>

{#if currentMarkType === 'bold'}
    <b>
      <slot></slot>
    </b>
{/if}