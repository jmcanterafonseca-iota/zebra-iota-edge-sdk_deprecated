<script>
  import { onDestroy, getContext } from 'svelte';
  import { modalStatus } from '@zebra-iota-edge-sdk/common';
  import Share from './Share.svelte';

  const { open } = getContext('simple-modal');

  const unsubscribe = modalStatus.subscribe((status) => {
    if (status.active) {
      if (status.type === 'share') {
        open(Share, { props: status.props });
      }
    }
  });

  onDestroy(unsubscribe);
</script>
