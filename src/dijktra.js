var INF = 1000000;
var dijktra = function(){
	//// initialize all variables
	var d = [];
	var heap = [];
	var heap_id = [];
	var heap_size = 0;

	//// heap and heap's functions
	//	heap swap: swap 2 items in heap by index
	function heap_swap(i, j) {
		heap_id[heap[i]] = j;
		heap_id[heap[j]] = i;
		t = heap[i];
		heap[i] = heap[j];
		heap[j] = t;
	}
	// heap up: check and up item by index with its father in heap
	function heap_up(i) {
		if ((i == 0) || (d[heap[Math.floor(i / 2)]] < d[heap[i]])) return;
		heap_swap(i, Math.floor(i / 2));
		heap_up(Math.floor(i / 2));
	}
	// heap down: check and down item by index with its father in heap
	function heap_down(i) {
		// console.log(i);
		var j = i * 2;
		if (j >= heap_size - 1) return;
		if ((j < heap_size - 1) && (d[heap[j]] > d[heap[j+1]])) j++;
		if (d[heap[i]] <= d[heap[j]]) return;
		heap_swap(i, j);
		heap_down(j);
	}
	// heap pop: remove item in heap by index
	function heap_pop(i) {
		heap[i] = heap[heap_size-1];
		heap_size--;
		heap.pop();
		heap_down(i);
		heap_up(i)
	}
	// heap push: add item to heap
	function heap_push(v) {
		heap_size++;
		heap.push(v);
		// console.log(heap_size);
		// console.log(heap);
		heap_up(heap_size-1)
	}


	//// get input is a sequence of edges
	function dijktra_heap(start, end, edge_matrix) {
		// init foot print array
		pre = [];
		for (var i = 0; i < edge_matrix.length; i++) pre.push(start);
		// initialize best path from start to all end points
		d = [];
		for (var i = 0; i < edge_matrix.length; i++) d.push(INF);
		d[start] = 0
		// console.log(d);
		// initialize heap
		heap = []
		heap_id = []
		heap_size = 0
		for (var i = 0; i < edge_matrix.length; i++) {
			heap_id.push(i)
			heap_push(i)
		}
		// initialize fixed array corresponding to fix node in best path
		fixed = [];
		for (var i = 0; i < edge_matrix.length; i++) fixed.push(false);
		// find best path
		for (var i = 0; i < edge_matrix.length; i++) {
			var heap_index = 0;
			var j = heap[heap_index];
			heap_pop(0);
			while (j === undefined) {
				heap_index++;
				if (heap_index === heap.length) break;
				j = heap[heap_index];
			}
			if (j === undefined) {
				continue;
			}
			fixed[j] = true;
			for (var k = 0; k < edge_matrix.length; k++) {
				if ((fixed[k] == false) && (edge_matrix[j][k] != INF) && (d[k] > d[j] + edge_matrix[j][k])) {
					d[k] = d[j] + edge_matrix[j][k];
					pre[k] = j;
					heap_up(heap_id[k]);
				}
			}
		}
		// return best path
		var i = end;
		var res = [];
		while (pre[i] != i) {
			res.push(i);
			i = pre[i];
		}
		res.push(start);

		return res.reverse();
	}
	return dijktra_heap;
}();

// //// if input is list of edges, change it to adjacent matrix (edge matrix)
// var edge_matrix = 	[[INF, 10, 3, 1], 
// 					[10, INF, INF, 3],
// 					[3, INF, INF, 5],
// 					[1, 3, 5, INF]];

// console.log(dijktra(0, 1, edge_matrix));
